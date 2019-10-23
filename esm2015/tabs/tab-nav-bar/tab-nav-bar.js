/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * \@docs-private
 * @abstract
 */
// tslint:disable-next-line:class-name
export class _MatTabNavBase extends MatPaginatedTabHeader {
    /**
     * @param {?} elementRef
     * @param {?} dir
     * @param {?} ngZone
     * @param {?} changeDetectorRef
     * @param {?} viewportRuler
     * @param {?=} platform
     * @param {?=} animationMode
     */
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, 
    /**
     * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
     */
    platform, animationMode) {
        super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
        this._disableRipple = false;
        /**
         * Theme color of the nav bar.
         */
        this.color = 'primary';
    }
    /**
     * Background color of the tab nav.
     * @return {?}
     */
    get backgroundColor() { return this._backgroundColor; }
    /**
     * @param {?} value
     * @return {?}
     */
    set backgroundColor(value) {
        /** @type {?} */
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(`mat-background-${this.backgroundColor}`);
        if (value) {
            classList.add(`mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /**
     * Whether the ripple effect is disabled or not.
     * @return {?}
     */
    get disableRipple() { return this._disableRipple; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disableRipple(value) { this._disableRipple = coerceBooleanProperty(value); }
    /**
     * @protected
     * @return {?}
     */
    _itemSelected() {
        // noop
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        // We need this to run before the `changes` subscription in parent to ensure that the
        // selectedIndex is up-to-date by the time the super class starts looking for it.
        this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            this.updateActiveLink();
        }));
        super.ngAfterContentInit();
    }
    /**
     * Notifies the component that the active link has been changed.
     * \@breaking-change 8.0.0 `element` parameter to be removed.
     * @param {?=} _element
     * @return {?}
     */
    updateActiveLink(_element) {
        if (!this._items) {
            return;
        }
        /** @type {?} */
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
}
_MatTabNavBase.decorators = [
    { type: Directive, args: [{
                // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                selector: 'do-not-use-abstract-mat-tab-nav-base'
            },] }
];
/** @nocollapse */
_MatTabNavBase.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: ViewportRuler },
    { type: Platform, decorators: [{ type: Optional }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
_MatTabNavBase.propDecorators = {
    backgroundColor: [{ type: Input }],
    disableRipple: [{ type: Input }],
    color: [{ type: Input }]
};
if (false) {
    /**
     * Query list of all tab links of the tab navigation.
     * @type {?}
     */
    _MatTabNavBase.prototype._items;
    /**
     * @type {?}
     * @private
     */
    _MatTabNavBase.prototype._backgroundColor;
    /**
     * @type {?}
     * @private
     */
    _MatTabNavBase.prototype._disableRipple;
    /**
     * Theme color of the nav bar.
     * @type {?}
     */
    _MatTabNavBase.prototype.color;
}
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export class MatTabNav extends _MatTabNavBase {
    /**
     * @param {?} elementRef
     * @param {?} dir
     * @param {?} ngZone
     * @param {?} changeDetectorRef
     * @param {?} viewportRuler
     * @param {?=} platform
     * @param {?=} animationMode
     */
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, 
    /**
     * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
     */
    platform, animationMode) {
        super(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode);
    }
}
MatTabNav.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
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
                styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center] .mat-tab-links{justify-content:center}[mat-align-tabs=end] .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}@media(-ms-high-contrast: active){.mat-ink-bar{outline:solid 2px;height:0}}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}@media(-ms-high-contrast: active){.mat-tab-link:focus{outline:dotted 2px}}.mat-tab-link.mat-tab-disabled{cursor:default}@media(-ms-high-contrast: active){.mat-tab-link.mat-tab-disabled{opacity:.5}}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}@media(-ms-high-contrast: active){.mat-tab-link{opacity:1}}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"]
            }] }
];
/** @nocollapse */
MatTabNav.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: ViewportRuler },
    { type: Platform, decorators: [{ type: Optional }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatTabNav.propDecorators = {
    _items: [{ type: ContentChildren, args: [forwardRef((/**
                 * @return {?}
                 */
                () => MatTabLink)), { descendants: true },] }],
    _inkBar: [{ type: ViewChild, args: [MatInkBar, { static: true },] }],
    _tabListContainer: [{ type: ViewChild, args: ['tabListContainer', { static: true },] }],
    _tabList: [{ type: ViewChild, args: ['tabList', { static: true },] }],
    _nextPaginator: [{ type: ViewChild, args: ['nextPaginator', { static: false },] }],
    _previousPaginator: [{ type: ViewChild, args: ['previousPaginator', { static: false },] }]
};
if (false) {
    /** @type {?} */
    MatTabNav.prototype._items;
    /** @type {?} */
    MatTabNav.prototype._inkBar;
    /** @type {?} */
    MatTabNav.prototype._tabListContainer;
    /** @type {?} */
    MatTabNav.prototype._tabList;
    /** @type {?} */
    MatTabNav.prototype._nextPaginator;
    /** @type {?} */
    MatTabNav.prototype._previousPaginator;
}
// Boilerplate for applying mixins to MatTabLink.
class MatTabLinkMixinBase {
}
/** @type {?} */
const _MatTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(MatTabLinkMixinBase)));
/**
 * Base class with all of the `MatTabLink` functionality.
 */
// tslint:disable-next-line:class-name
export class _MatTabLinkBase extends _MatTabLinkMixinBase {
    /**
     * @param {?} _tabNavBar
     * @param {?} elementRef
     * @param {?} globalRippleOptions
     * @param {?} tabIndex
     * @param {?} _focusMonitor
     * @param {?=} animationMode
     */
    constructor(_tabNavBar, elementRef, globalRippleOptions, tabIndex, _focusMonitor, animationMode) {
        super();
        this._tabNavBar = _tabNavBar;
        this.elementRef = elementRef;
        this._focusMonitor = _focusMonitor;
        /**
         * Whether the tab link is active or not.
         */
        this._isActive = false;
        this.rippleConfig = globalRippleOptions || {};
        this.tabIndex = parseInt(tabIndex) || 0;
        if (animationMode === 'NoopAnimations') {
            this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
        }
        _focusMonitor.monitor(elementRef);
    }
    /**
     * Whether the link is active.
     * @return {?}
     */
    get active() { return this._isActive; }
    /**
     * @param {?} value
     * @return {?}
     */
    set active(value) {
        if (value !== this._isActive) {
            this._isActive = value;
            this._tabNavBar.updateActiveLink(this.elementRef);
        }
    }
    /**
     * Whether ripples are disabled on interaction.
     * \@docs-private
     * @return {?}
     */
    get rippleDisabled() {
        return this.disabled || this.disableRipple || this._tabNavBar.disableRipple ||
            !!this.rippleConfig.disabled;
    }
    /**
     * @return {?}
     */
    focus() {
        this.elementRef.nativeElement.focus();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this.elementRef);
    }
}
_MatTabLinkBase.decorators = [
    { type: Directive, args: [{
                // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                selector: 'do-not-use-abstract-mat-tab-link-base'
            },] }
];
/** @nocollapse */
_MatTabLinkBase.ctorParameters = () => [
    { type: _MatTabNavBase },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: FocusMonitor },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
_MatTabLinkBase.propDecorators = {
    active: [{ type: Input }]
};
if (false) {
    /**
     * Whether the tab link is active or not.
     * @type {?}
     * @protected
     */
    _MatTabLinkBase.prototype._isActive;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the tab link ripples.
     * \@docs-private
     * @type {?}
     */
    _MatTabLinkBase.prototype.rippleConfig;
    /**
     * @type {?}
     * @private
     */
    _MatTabLinkBase.prototype._tabNavBar;
    /** @type {?} */
    _MatTabLinkBase.prototype.elementRef;
    /**
     * @type {?}
     * @private
     */
    _MatTabLinkBase.prototype._focusMonitor;
}
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
export class MatTabLink extends _MatTabLinkBase {
    /**
     * @param {?} tabNavBar
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} platform
     * @param {?} globalRippleOptions
     * @param {?} tabIndex
     * @param {?} focusMonitor
     * @param {?=} animationMode
     */
    constructor(tabNavBar, elementRef, ngZone, platform, globalRippleOptions, tabIndex, focusMonitor, animationMode) {
        super(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode);
        this._tabLinkRipple = new RippleRenderer(this, ngZone, elementRef, platform);
        this._tabLinkRipple.setupTriggerEvents(elementRef.nativeElement);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._tabLinkRipple._removeTriggerEvents();
    }
}
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
MatTabLink.ctorParameters = () => [
    { type: MatTabNav },
    { type: ElementRef },
    { type: NgZone },
    { type: Platform },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: FocusMonitor },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
if (false) {
    /**
     * Reference to the RippleRenderer for the tab-link.
     * @type {?}
     * @private
     */
    MatTabLink.prototype._tabLinkRipple;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFHTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBSUwseUJBQXlCLEVBQ3pCLGFBQWEsRUFDYixrQkFBa0IsRUFDbEIsYUFBYSxFQUViLGNBQWMsR0FHZixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxZQUFZLEVBQWtCLE1BQU0sbUJBQW1CLENBQUM7QUFDaEUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUMscUJBQXFCLEVBQTRCLE1BQU0seUJBQXlCLENBQUM7QUFDekYsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBVXBELHNDQUFzQztBQUN0QyxNQUFNLE9BQWdCLGNBQWUsU0FBUSxxQkFBcUI7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TUFBTSxTQUFDLHFCQUFxQjs7Ozs7Ozs7SUFQM0Msb0NBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSwgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIEhhc1RhYkluZGV4LCBIYXNUYWJJbmRleEN0b3IsXG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCwgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVSZW5kZXJlcixcbiAgUmlwcGxlVGFyZ2V0LFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuLi9pbmstYmFyJztcbmltcG9ydCB7TWF0UGFnaW5hdGVkVGFiSGVhZGVyLCBNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtfSBmcm9tICcuLi9wYWdpbmF0ZWQtdGFiLWhlYWRlcic7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYk5hdmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHNlbGVjdG9yIGNhbiBiZSByZW1vdmVkIHdoZW4gd2UgdXBkYXRlIHRvIEFuZ3VsYXIgOS4wLlxuICBzZWxlY3RvcjogJ2RvLW5vdC11c2UtYWJzdHJhY3QtbWF0LXRhYi1uYXYtYmFzZSdcbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJOYXZCYXNlIGV4dGVuZHMgTWF0UGFnaW5hdGVkVGFiSGVhZGVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcblxuICAvKiogUXVlcnkgbGlzdCBvZiBhbGwgdGFiIGxpbmtzIG9mIHRoZSB0YWIgbmF2aWdhdGlvbi4gKi9cbiAgYWJzdHJhY3QgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbSAmIHthY3RpdmU6IGJvb2xlYW59PjtcblxuICAvKiogQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgdGFiIG5hdi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJhY2tncm91bmRDb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fYmFja2dyb3VuZENvbG9yOyB9XG4gIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhY2tncm91bmQtJHt0aGlzLmJhY2tncm91bmRDb2xvcn1gKTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY2xhc3NMaXN0LmFkZChgbWF0LWJhY2tncm91bmQtJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9iYWNrZ3JvdW5kQ29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIGVmZmVjdCBpcyBkaXNhYmxlZCBvciBub3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUmlwcGxlKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZVJpcHBsZTsgfVxuICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlbWUgY29sb3Igb2YgdGhlIG5hdiBiYXIuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEBkZXByZWNhdGVkIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYHBsYXRmb3JtYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcGxhdGZvcm0/OiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBjaGFuZ2VEZXRlY3RvclJlZiwgdmlld3BvcnRSdWxlciwgZGlyLCBuZ1pvbmUsIHBsYXRmb3JtLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfaXRlbVNlbGVjdGVkKCkge1xuICAgIC8vIG5vb3BcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAvLyBXZSBuZWVkIHRoaXMgdG8gcnVuIGJlZm9yZSB0aGUgYGNoYW5nZXNgIHN1YnNjcmlwdGlvbiBpbiBwYXJlbnQgdG8gZW5zdXJlIHRoYXQgdGhlXG4gICAgLy8gc2VsZWN0ZWRJbmRleCBpcyB1cC10by1kYXRlIGJ5IHRoZSB0aW1lIHRoZSBzdXBlciBjbGFzcyBzdGFydHMgbG9va2luZyBmb3IgaXQuXG4gICAgdGhpcy5faXRlbXMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUFjdGl2ZUxpbmsoKTtcbiAgICB9KTtcblxuICAgIHN1cGVyLm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmaWVzIHRoZSBjb21wb25lbnQgdGhhdCB0aGUgYWN0aXZlIGxpbmsgaGFzIGJlZW4gY2hhbmdlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgZWxlbWVudGAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICB1cGRhdGVBY3RpdmVMaW5rKF9lbGVtZW50PzogRWxlbWVudFJlZikge1xuICAgIGlmICghdGhpcy5faXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVtc1tpXS5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGUgaW5rIGJhciBzaG91bGQgaGlkZSBpdHNlbGYgaWYgbm8gaXRlbXMgYXJlIGFjdGl2ZS5cbiAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcbiAgICB0aGlzLl9pbmtCYXIuaGlkZSgpO1xuICB9XG59XG5cblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCBtYXRjaGluZyB0aGUgc3R5bGVzIG9mIHRoZSB0YWIgZ3JvdXAgaGVhZGVyLlxuICogUHJvdmlkZXMgYW5jaG9yZWQgbmF2aWdhdGlvbiB3aXRoIGFuaW1hdGVkIGluayBiYXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ1ttYXQtdGFiLW5hdi1iYXJdJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJOYXZCYXIsIG1hdFRhYk5hdicsXG4gIGlucHV0czogWydjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1uYXYtYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGFiLW5hdi1iYXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1uYXYtYmFyIG1hdC10YWItaGVhZGVyJyxcbiAgICAnW2NsYXNzLm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tY29udHJvbHMtZW5hYmxlZF0nOiAnX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMnLFxuICAgICdbY2xhc3MubWF0LXRhYi1oZWFkZXItcnRsXSc6IFwiX2dldExheW91dERpcmVjdGlvbigpID09ICdydGwnXCIsXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgIT09IFwid2FyblwiICYmIGNvbG9yICE9PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYk5hdiBleHRlbmRzIF9NYXRUYWJOYXZCYXNlIHtcbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE1hdFRhYkxpbmspLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRUYWJMaW5rPjtcbiAgQFZpZXdDaGlsZChNYXRJbmtCYXIsIHtzdGF0aWM6IHRydWV9KSBfaW5rQmFyOiBNYXRJbmtCYXI7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3RDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3QnLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3Q6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InLCB7c3RhdGljOiBmYWxzZX0pIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InLCB7c3RhdGljOiBmYWxzZX0pIF9wcmV2aW91c1BhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYHBsYXRmb3JtYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpIHBsYXRmb3JtPzogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkaXIsIG5nWm9uZSwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIHBsYXRmb3JtLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkxpbmsuXG5jbGFzcyBNYXRUYWJMaW5rTWl4aW5CYXNlIHt9XG5jb25zdCBfTWF0VGFiTGlua01peGluQmFzZTpcbiAgICBIYXNUYWJJbmRleEN0b3IgJiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFRhYkxpbmtNaXhpbkJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZVJpcHBsZShtaXhpbkRpc2FibGVkKE1hdFRhYkxpbmtNaXhpbkJhc2UpKSk7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiTGlua2AgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoe1xuICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBzZWxlY3RvciBjYW4gYmUgcmVtb3ZlZCB3aGVuIHdlIHVwZGF0ZSB0byBBbmd1bGFyIDkuMC5cbiAgc2VsZWN0b3I6ICdkby1ub3QtdXNlLWFic3RyYWN0LW1hdC10YWItbGluay1iYXNlJ1xufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdFRhYkxpbmtCYXNlIGV4dGVuZHMgX01hdFRhYkxpbmtNaXhpbkJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsIEhhc1RhYkluZGV4LCBSaXBwbGVUYXJnZXQsIEZvY3VzYWJsZU9wdGlvbiB7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRhYiBsaW5rIGlzIGFjdGl2ZSBvciBub3QuICovXG4gIHByb3RlY3RlZCBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbGluayBpcyBhY3RpdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9pc0FjdGl2ZTsgfVxuICBzZXQgYWN0aXZlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3RhYk5hdkJhci51cGRhdGVBY3RpdmVMaW5rKHRoaXMuZWxlbWVudFJlZik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJpcHBsZSBjb25maWd1cmF0aW9uIGZvciByaXBwbGVzIHRoYXQgYXJlIGxhdW5jaGVkIG9uIHBvaW50ZXIgZG93bi4gVGhlIHJpcHBsZSBjb25maWdcbiAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAqIHRoZSB0YWIgbGluayByaXBwbGVzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZyAmIFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgb24gaW50ZXJhY3Rpb24uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5fdGFiTmF2QmFyLmRpc2FibGVSaXBwbGUgfHxcbiAgICAgICEhdGhpcy5yaXBwbGVDb25maWcuZGlzYWJsZWQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX3RhYk5hdkJhcjogX01hdFRhYk5hdkJhc2UsIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zfG51bGwsXG4gICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yaXBwbGVDb25maWcgPSBnbG9iYWxSaXBwbGVPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcblxuICAgIGlmIChhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICB0aGlzLnJpcHBsZUNvbmZpZy5hbmltYXRpb24gPSB7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfTtcbiAgICB9XG5cbiAgICBfZm9jdXNNb25pdG9yLm1vbml0b3IoZWxlbWVudFJlZik7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuZWxlbWVudFJlZik7XG4gIH1cbn1cblxuXG4vKipcbiAqIExpbmsgaW5zaWRlIG9mIGEgYG1hdC10YWItbmF2LWJhcmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtdGFiLWxpbmtdLCBbbWF0VGFiTGlua10nLFxuICBleHBvcnRBczogJ21hdFRhYkxpbmsnLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItbGluaycsXG4gICAgJ1thdHRyLmFyaWEtY3VycmVudF0nOiAnYWN0aXZlID8gXCJwYWdlXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJJbmRleF0nOiAndGFiSW5kZXgnLFxuICAgICdbY2xhc3MubWF0LXRhYi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXRhYi1sYWJlbC1hY3RpdmVdJzogJ2FjdGl2ZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTGluayBleHRlbmRzIF9NYXRUYWJMaW5rQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIFJpcHBsZVJlbmRlcmVyIGZvciB0aGUgdGFiLWxpbmsuICovXG4gIHByaXZhdGUgX3RhYkxpbmtSaXBwbGU6IFJpcHBsZVJlbmRlcmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRhYk5hdkJhcjogTWF0VGFiTmF2LCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zfG51bGwsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLCBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKHRhYk5hdkJhciwgZWxlbWVudFJlZiwgZ2xvYmFsUmlwcGxlT3B0aW9ucywgdGFiSW5kZXgsIGZvY3VzTW9uaXRvciwgYW5pbWF0aW9uTW9kZSk7XG4gICAgdGhpcy5fdGFiTGlua1JpcHBsZSA9IG5ldyBSaXBwbGVSZW5kZXJlcih0aGlzLCBuZ1pvbmUsIGVsZW1lbnRSZWYsIHBsYXRmb3JtKTtcbiAgICB0aGlzLl90YWJMaW5rUmlwcGxlLnNldHVwVHJpZ2dlckV2ZW50cyhlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl90YWJMaW5rUmlwcGxlLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cbn1cbiJdfQ==