import { __extends } from "tslib";
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
var _MatTabNavBase = /** @class */ (function (_super) {
    __extends(_MatTabNavBase, _super);
    function _MatTabNavBase(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, 
    /**
     * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
     */
    platform, animationMode) {
        var _this = _super.call(this, elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode) || this;
        _this._disableRipple = false;
        /** Theme color of the nav bar. */
        _this.color = 'primary';
        return _this;
    }
    Object.defineProperty(_MatTabNavBase.prototype, "backgroundColor", {
        /** Background color of the tab nav. */
        get: function () { return this._backgroundColor; },
        set: function (value) {
            var classList = this._elementRef.nativeElement.classList;
            classList.remove("mat-background-" + this.backgroundColor);
            if (value) {
                classList.add("mat-background-" + value);
            }
            this._backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatTabNavBase.prototype, "disableRipple", {
        /** Whether the ripple effect is disabled or not. */
        get: function () { return this._disableRipple; },
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    _MatTabNavBase.prototype._itemSelected = function () {
        // noop
    };
    _MatTabNavBase.prototype.ngAfterContentInit = function () {
        var _this = this;
        // We need this to run before the `changes` subscription in parent to ensure that the
        // selectedIndex is up-to-date by the time the super class starts looking for it.
        this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(function () {
            _this.updateActiveLink();
        });
        _super.prototype.ngAfterContentInit.call(this);
    };
    /**
     * Notifies the component that the active link has been changed.
     * @breaking-change 8.0.0 `element` parameter to be removed.
     */
    _MatTabNavBase.prototype.updateActiveLink = function (_element) {
        if (!this._items) {
            return;
        }
        var items = this._items.toArray();
        for (var i = 0; i < items.length; i++) {
            if (items[i].active) {
                this.selectedIndex = i;
                this._changeDetectorRef.markForCheck();
                return;
            }
        }
        // The ink bar should hide itself if no items are active.
        this.selectedIndex = -1;
        this._inkBar.hide();
    };
    _MatTabNavBase.decorators = [
        { type: Directive }
    ];
    /** @nocollapse */
    _MatTabNavBase.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: ViewportRuler },
        { type: Platform, decorators: [{ type: Optional }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    _MatTabNavBase.propDecorators = {
        backgroundColor: [{ type: Input }],
        disableRipple: [{ type: Input }],
        color: [{ type: Input }]
    };
    return _MatTabNavBase;
}(MatPaginatedTabHeader));
export { _MatTabNavBase };
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
var MatTabNav = /** @class */ (function (_super) {
    __extends(MatTabNav, _super);
    function MatTabNav(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, 
    /**
     * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
     */
    platform, animationMode) {
        return _super.call(this, elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) || this;
    }
    MatTabNav.decorators = [
        { type: Component, args: [{
                    selector: '[mat-tab-nav-bar]',
                    exportAs: 'matTabNavBar, matTabNav',
                    inputs: ['color'],
                    template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n\n<div class=\"mat-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div class=\"mat-tab-list\" #tabList (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-links\">\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     (mousedown)=\"_handlePaginatorPress('after')\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n",
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
                    styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center] .mat-tab-links{justify-content:center}[mat-align-tabs=end] .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-link:focus{outline:dotted 2px}.mat-tab-link.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-link.mat-tab-disabled{opacity:.5}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-link{opacity:1}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"]
                }] }
    ];
    /** @nocollapse */
    MatTabNav.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: ViewportRuler },
        { type: Platform, decorators: [{ type: Optional }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    MatTabNav.propDecorators = {
        _items: [{ type: ContentChildren, args: [forwardRef(function () { return MatTabLink; }), { descendants: true },] }],
        _inkBar: [{ type: ViewChild, args: [MatInkBar, { static: true },] }],
        _tabListContainer: [{ type: ViewChild, args: ['tabListContainer', { static: true },] }],
        _tabList: [{ type: ViewChild, args: ['tabList', { static: true },] }],
        _nextPaginator: [{ type: ViewChild, args: ['nextPaginator',] }],
        _previousPaginator: [{ type: ViewChild, args: ['previousPaginator',] }]
    };
    return MatTabNav;
}(_MatTabNavBase));
export { MatTabNav };
// Boilerplate for applying mixins to MatTabLink.
var MatTabLinkMixinBase = /** @class */ (function () {
    function MatTabLinkMixinBase() {
    }
    return MatTabLinkMixinBase;
}());
var _MatTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(MatTabLinkMixinBase)));
/** Base class with all of the `MatTabLink` functionality. */
var _MatTabLinkBase = /** @class */ (function (_super) {
    __extends(_MatTabLinkBase, _super);
    function _MatTabLinkBase(_tabNavBar, elementRef, globalRippleOptions, tabIndex, _focusMonitor, animationMode) {
        var _this = _super.call(this) || this;
        _this._tabNavBar = _tabNavBar;
        _this.elementRef = elementRef;
        _this._focusMonitor = _focusMonitor;
        /** Whether the tab link is active or not. */
        _this._isActive = false;
        _this.rippleConfig = globalRippleOptions || {};
        _this.tabIndex = parseInt(tabIndex) || 0;
        if (animationMode === 'NoopAnimations') {
            _this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
        }
        _focusMonitor.monitor(elementRef);
        return _this;
    }
    Object.defineProperty(_MatTabLinkBase.prototype, "active", {
        /** Whether the link is active. */
        get: function () { return this._isActive; },
        set: function (value) {
            if (value !== this._isActive) {
                this._isActive = value;
                this._tabNavBar.updateActiveLink(this.elementRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatTabLinkBase.prototype, "rippleDisabled", {
        /**
         * Whether ripples are disabled on interaction.
         * @docs-private
         */
        get: function () {
            return this.disabled || this.disableRipple || this._tabNavBar.disableRipple ||
                !!this.rippleConfig.disabled;
        },
        enumerable: true,
        configurable: true
    });
    _MatTabLinkBase.prototype.focus = function () {
        this.elementRef.nativeElement.focus();
    };
    _MatTabLinkBase.prototype.ngOnDestroy = function () {
        this._focusMonitor.stopMonitoring(this.elementRef);
    };
    _MatTabLinkBase.decorators = [
        { type: Directive }
    ];
    /** @nocollapse */
    _MatTabLinkBase.ctorParameters = function () { return [
        { type: _MatTabNavBase },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: FocusMonitor },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    _MatTabLinkBase.propDecorators = {
        active: [{ type: Input }]
    };
    return _MatTabLinkBase;
}(_MatTabLinkMixinBase));
export { _MatTabLinkBase };
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
var MatTabLink = /** @class */ (function (_super) {
    __extends(MatTabLink, _super);
    function MatTabLink(tabNavBar, elementRef, ngZone, platform, globalRippleOptions, tabIndex, focusMonitor, animationMode) {
        var _this = _super.call(this, tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode) || this;
        _this._tabLinkRipple = new RippleRenderer(_this, ngZone, elementRef, platform);
        _this._tabLinkRipple.setupTriggerEvents(elementRef.nativeElement);
        return _this;
    }
    MatTabLink.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this._tabLinkRipple._removeTriggerEvents();
    };
    MatTabLink.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-tab-link], [matTabLink]',
                    exportAs: 'matTabLink',
                    inputs: ['disabled', 'disableRipple', 'tabIndex'],
                    host: {
                        'class': 'mat-tab-link',
                        '[attr.aria-current]': 'active ? "page" : null',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.tabIndex]': 'tabIndex',
                        '[class.mat-tab-disabled]': 'disabled',
                        '[class.mat-tab-label-active]': 'active',
                    }
                },] }
    ];
    /** @nocollapse */
    MatTabLink.ctorParameters = function () { return [
        { type: MatTabNav },
        { type: ElementRef },
        { type: NgZone },
        { type: Platform },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: FocusMonitor },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    return MatTabLink;
}(_MatTabLinkBase));
export { MatTabLink };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUdMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFJTCx5QkFBeUIsRUFDekIsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEVBRWIsY0FBYyxHQUdmLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFlLHFCQUFxQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDdkYsT0FBTyxFQUFDLFlBQVksRUFBa0IsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxxQkFBcUIsRUFBNEIsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RixPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBEOzs7R0FHRztBQUNIO0lBRTZDLGtDQUFxQjtJQThC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ZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LCBIYXNUYWJJbmRleEN0b3IsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCwgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuLi9pbmstYmFyJztcbmltcG9ydCB7TWF0UGFnaW5hdGVkVGFiSGVhZGVyLCBNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtfSBmcm9tICcuLi9wYWdpbmF0ZWQtdGFiLWhlYWRlcic7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYk5hdmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJOYXZCYXNlIGV4dGVuZHMgTWF0UGFnaW5hdGVkVGFiSGVhZGVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcblxuICAvKiogUXVlcnkgbGlzdCBvZiBhbGwgdGFiIGxpbmtzIG9mIHRoZSB0YWIgbmF2aWdhdGlvbi4gKi9cbiAgYWJzdHJhY3QgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbSAmIHthY3RpdmU6IGJvb2xlYW59PjtcblxuICAvKiogQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgdGFiIG5hdi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJhY2tncm91bmRDb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fYmFja2dyb3VuZENvbG9yOyB9XG4gIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhY2tncm91bmQtJHt0aGlzLmJhY2tncm91bmRDb2xvcn1gKTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY2xhc3NMaXN0LmFkZChgbWF0LWJhY2tncm91bmQtJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9iYWNrZ3JvdW5kQ29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIGVmZmVjdCBpcyBkaXNhYmxlZCBvciBub3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUmlwcGxlKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZVJpcHBsZTsgfVxuICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlbWUgY29sb3Igb2YgdGhlIG5hdiBiYXIuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEBkZXByZWNhdGVkIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYHBsYXRmb3JtYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcGxhdGZvcm0/OiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBjaGFuZ2VEZXRlY3RvclJlZiwgdmlld3BvcnRSdWxlciwgZGlyLCBuZ1pvbmUsIHBsYXRmb3JtLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfaXRlbVNlbGVjdGVkKCkge1xuICAgIC8vIG5vb3BcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAvLyBXZSBuZWVkIHRoaXMgdG8gcnVuIGJlZm9yZSB0aGUgYGNoYW5nZXNgIHN1YnNjcmlwdGlvbiBpbiBwYXJlbnQgdG8gZW5zdXJlIHRoYXQgdGhlXG4gICAgLy8gc2VsZWN0ZWRJbmRleCBpcyB1cC10by1kYXRlIGJ5IHRoZSB0aW1lIHRoZSBzdXBlciBjbGFzcyBzdGFydHMgbG9va2luZyBmb3IgaXQuXG4gICAgdGhpcy5faXRlbXMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUFjdGl2ZUxpbmsoKTtcbiAgICB9KTtcblxuICAgIHN1cGVyLm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmaWVzIHRoZSBjb21wb25lbnQgdGhhdCB0aGUgYWN0aXZlIGxpbmsgaGFzIGJlZW4gY2hhbmdlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgZWxlbWVudGAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICB1cGRhdGVBY3RpdmVMaW5rKF9lbGVtZW50PzogRWxlbWVudFJlZikge1xuICAgIGlmICghdGhpcy5faXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVtc1tpXS5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGUgaW5rIGJhciBzaG91bGQgaGlkZSBpdHNlbGYgaWYgbm8gaXRlbXMgYXJlIGFjdGl2ZS5cbiAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcbiAgICB0aGlzLl9pbmtCYXIuaGlkZSgpO1xuICB9XG59XG5cblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCBtYXRjaGluZyB0aGUgc3R5bGVzIG9mIHRoZSB0YWIgZ3JvdXAgaGVhZGVyLlxuICogUHJvdmlkZXMgYW5jaG9yZWQgbmF2aWdhdGlvbiB3aXRoIGFuaW1hdGVkIGluayBiYXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtdGFiLW5hdi1iYXJdJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJOYXZCYXIsIG1hdFRhYk5hdicsXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1uYXYtYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGFiLW5hdi1iYXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1uYXYtYmFyIG1hdC10YWItaGVhZGVyJyxcbiAgICAnW2NsYXNzLm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tY29udHJvbHMtZW5hYmxlZF0nOiAnX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMnLFxuICAgICdbY2xhc3MubWF0LXRhYi1oZWFkZXItcnRsXSc6IFwiX2dldExheW91dERpcmVjdGlvbigpID09ICdydGwnXCIsXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgIT09IFwid2FyblwiICYmIGNvbG9yICE9PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYk5hdiBleHRlbmRzIF9NYXRUYWJOYXZCYXNlIHtcbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE1hdFRhYkxpbmspLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRUYWJMaW5rPjtcbiAgQFZpZXdDaGlsZChNYXRJbmtCYXIsIHtzdGF0aWM6IHRydWV9KSBfaW5rQmFyOiBNYXRJbmtCYXI7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3RDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3QnLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3Q6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InKSBfbmV4dFBhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpb3VzUGFnaW5hdG9yJykgX3ByZXZpb3VzUGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBgcGxhdGZvcm1gIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKCkgcGxhdGZvcm0/OiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRpciwgbmdab25lLCBjaGFuZ2VEZXRlY3RvclJlZiwgdmlld3BvcnRSdWxlciwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IE51bWJlcklucHV0O1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkxpbmsuXG5jbGFzcyBNYXRUYWJMaW5rTWl4aW5CYXNlIHt9XG5jb25zdCBfTWF0VGFiTGlua01peGluQmFzZTpcbiAgICBIYXNUYWJJbmRleEN0b3IgJiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFRhYkxpbmtNaXhpbkJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZVJpcHBsZShtaXhpbkRpc2FibGVkKE1hdFRhYkxpbmtNaXhpbkJhc2UpKSk7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiTGlua2AgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0VGFiTGlua0Jhc2UgZXh0ZW5kcyBfTWF0VGFiTGlua01peGluQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgSGFzVGFiSW5kZXgsIFJpcHBsZVRhcmdldCwgRm9jdXNhYmxlT3B0aW9uIHtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpbmsgaXMgYWN0aXZlIG9yIG5vdC4gKi9cbiAgcHJvdGVjdGVkIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaW5rIGlzIGFjdGl2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2lzQWN0aXZlOyB9XG4gIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fdGFiTmF2QmFyLnVwZGF0ZUFjdGl2ZUxpbmsodGhpcy5lbGVtZW50UmVmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIHRhYiBsaW5rIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLl90YWJOYXZCYXIuZGlzYWJsZVJpcHBsZSB8fFxuICAgICAgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfdGFiTmF2QmFyOiBfTWF0VGFiTmF2QmFzZSwgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnN8bnVsbCxcbiAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZywgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgaWYgKGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMucmlwcGxlQ29uZmlnLmFuaW1hdGlvbiA9IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9O1xuICAgIH1cblxuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihlbGVtZW50UmVmKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5lbGVtZW50UmVmKTtcbiAgfVxufVxuXG5cbi8qKlxuICogTGluayBpbnNpZGUgb2YgYSBgbWF0LXRhYi1uYXYtYmFyYC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC10YWItbGlua10sIFttYXRUYWJMaW5rXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTGluaycsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1saW5rJyxcbiAgICAnW2F0dHIuYXJpYS1jdXJyZW50XSc6ICdhY3RpdmUgPyBcInBhZ2VcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLnRhYkluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWxhYmVsLWFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJMaW5rIGV4dGVuZHMgX01hdFRhYkxpbmtCYXNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgUmlwcGxlUmVuZGVyZXIgZm9yIHRoZSB0YWItbGluay4gKi9cbiAgcHJpdmF0ZSBfdGFiTGlua1JpcHBsZTogUmlwcGxlUmVuZGVyZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdGFiTmF2QmFyOiBNYXRUYWJOYXYsIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnN8bnVsbCxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIodGFiTmF2QmFyLCBlbGVtZW50UmVmLCBnbG9iYWxSaXBwbGVPcHRpb25zLCB0YWJJbmRleCwgZm9jdXNNb25pdG9yLCBhbmltYXRpb25Nb2RlKTtcbiAgICB0aGlzLl90YWJMaW5rUmlwcGxlID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRoaXMsIG5nWm9uZSwgZWxlbWVudFJlZiwgcGxhdGZvcm0pO1xuICAgIHRoaXMuX3RhYkxpbmtSaXBwbGUuc2V0dXBUcmlnZ2VyRXZlbnRzKGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYkxpbmtSaXBwbGUuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuIl19