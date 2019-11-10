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
    { type: Directive }
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
    _nextPaginator: [{ type: ViewChild, args: ['nextPaginator',] }],
    _previousPaginator: [{ type: ViewChild, args: ['previousPaginator',] }]
};
if (false) {
    /** @type {?} */
    MatTabNav.ngAcceptInputType_disableRipple;
    /** @type {?} */
    MatTabNav.ngAcceptInputType_selectedIndex;
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
    { type: Directive }
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
    /** @type {?} */
    MatTabLink.ngAcceptInputType_disabled;
    /** @type {?} */
    MatTabLink.ngAcceptInputType_disableRipple;
    /**
     * Reference to the RippleRenderer for the tab-link.
     * @type {?}
     * @private
     */
    MatTabLink.prototype._tabLinkRipple;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFHTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBSUwseUJBQXlCLEVBQ3pCLGFBQWEsRUFDYixrQkFBa0IsRUFDbEIsYUFBYSxFQUViLGNBQWMsR0FHZixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxZQUFZLEVBQWtCLE1BQU0sbUJBQW1CLENBQUM7QUFDaEUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUMscUJBQXFCLEVBQTRCLE1BQU0seUJBQXlCLENBQUM7QUFDekYsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBT3BELHNDQUFzQztBQUN0QyxNQUFNLE9BQWdCLGNBQWUsU0FBUSxxQkFBcUI7Ozs7Ozs7Ozs7SUE4QmhFLFlBQVksVUFBc0IsRUFDVixHQUFtQixFQUMvQixNQUFjLEVBQ2QsaUJBQW9DLEVBQ3BDLGFBQTRCO0lBQzVCOztPQUVHO0lBQ1MsUUFBbUIsRUFDWSxhQUFzQjtRQUMzRSxLQUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQWZwRixtQkFBYyxHQUFZLEtBQUssQ0FBQzs7OztRQUcvQixVQUFLLEdBQWlCLFNBQVMsQ0FBQztJQWF6QyxDQUFDOzs7OztJQWxDRCxJQUNJLGVBQWUsS0FBbUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOzs7OztJQUNyRSxJQUFJLGVBQWUsQ0FBQyxLQUFtQjs7Y0FDL0IsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVM7UUFDMUQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBSSxLQUFLLEVBQUU7WUFDVCxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDOzs7OztJQUlELElBQ0ksYUFBYSxLQUFLLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ25ELElBQUksYUFBYSxDQUFDLEtBQVUsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFtQjNFLGFBQWE7UUFDckIsT0FBTztJQUNULENBQUM7Ozs7SUFFRCxrQkFBa0I7UUFDaEIscUZBQXFGO1FBQ3JGLGlGQUFpRjtRQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUU7WUFDbkYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDMUIsQ0FBQyxFQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM3QixDQUFDOzs7Ozs7O0lBTUQsZ0JBQWdCLENBQUMsUUFBcUI7UUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsT0FBTztTQUNSOztjQUVLLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUVuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3ZDLE9BQU87YUFDUjtTQUNGO1FBRUQseURBQXlEO1FBQ3pELElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7WUFqRkYsU0FBUzs7OztZQW5DUixVQUFVO1lBWkosY0FBYyx1QkFnRlAsUUFBUTtZQWhFckIsTUFBTTtZQVJOLGlCQUFpQjtZQU5YLGFBQWE7WUFEYixRQUFRLHVCQXNGRCxRQUFRO3lDQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7OEJBaENwRCxLQUFLOzRCQWVMLEtBQUs7b0JBTUwsS0FBSzs7Ozs7OztJQXhCTixnQ0FBMEU7Ozs7O0lBZTFFLDBDQUF1Qzs7Ozs7SUFNdkMsd0NBQXdDOzs7OztJQUd4QywrQkFBeUM7Ozs7OztBQTZFM0MsTUFBTSxPQUFPLFNBQVUsU0FBUSxjQUFjOzs7Ozs7Ozs7O0lBUTNDLFlBQVksVUFBc0IsRUFDcEIsR0FBbUIsRUFDL0IsTUFBYyxFQUNkLGlCQUFvQyxFQUNwQyxhQUE0QjtJQUM1Qjs7T0FFRztJQUNTLFFBQW1CLEVBQ1ksYUFBc0I7UUFDakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUYsQ0FBQzs7O1lBckNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLGt6Q0FBK0I7Z0JBRS9CLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsZ0NBQWdDO29CQUN6QyxvREFBb0QsRUFBRSx5QkFBeUI7b0JBQy9FLDRCQUE0QixFQUFFLGdDQUFnQztvQkFDOUQscUJBQXFCLEVBQUUsd0NBQXdDO29CQUMvRCxvQkFBb0IsRUFBRSxvQkFBb0I7b0JBQzFDLGtCQUFrQixFQUFFLGtCQUFrQjtpQkFDdkM7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2dCQUVyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTzs7YUFDakQ7Ozs7WUE3SUMsVUFBVTtZQVpKLGNBQWMsdUJBbUtqQixRQUFRO1lBbkpYLE1BQU07WUFSTixpQkFBaUI7WUFOWCxhQUFhO1lBRGIsUUFBUSx1QkF5S1gsUUFBUTt5Q0FDUixRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O3FCQWhCMUMsZUFBZSxTQUFDLFVBQVU7OztnQkFBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7c0JBQ2pFLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dDQUNuQyxTQUFTLFNBQUMsa0JBQWtCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO3VCQUM1QyxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs2QkFDbkMsU0FBUyxTQUFDLGVBQWU7aUNBQ3pCLFNBQVMsU0FBQyxtQkFBbUI7Ozs7SUFlOUIsMENBQTRFOztJQUM1RSwwQ0FBMkU7O0lBckIzRSwyQkFBa0c7O0lBQ2xHLDRCQUF5RDs7SUFDekQsc0NBQTZFOztJQUM3RSw2QkFBMkQ7O0lBQzNELG1DQUFvRTs7SUFDcEUsdUNBQTRFOzs7QUFvQjlFLE1BQU0sbUJBQW1CO0NBQUc7O01BQ3RCLG9CQUFvQixHQUVsQixhQUFhLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzs7OztBQUk3RSxzQ0FBc0M7QUFDdEMsTUFBTSxPQUFPLGVBQWdCLFNBQVEsb0JBQW9COzs7Ozs7Ozs7SUFpQ3ZELFlBQ1ksVUFBMEIsRUFBUyxVQUFzQixFQUNsQixtQkFBNkMsRUFDckUsUUFBZ0IsRUFBVSxhQUEyQixFQUNqQyxhQUFzQjtRQUNuRSxLQUFLLEVBQUUsQ0FBQztRQUpFLGVBQVUsR0FBVixVQUFVLENBQWdCO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUVoQixrQkFBYSxHQUFiLGFBQWEsQ0FBYzs7OztRQWhDdEUsY0FBUyxHQUFZLEtBQUssQ0FBQztRQW9DbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxtQkFBbUIsSUFBSSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksYUFBYSxLQUFLLGdCQUFnQixFQUFFO1lBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUM7U0FDbkU7UUFFRCxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Ozs7O0lBekNELElBQ0ksTUFBTSxLQUFjLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ2hELElBQUksTUFBTSxDQUFDLEtBQWM7UUFDdkIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7Ozs7OztJQWNELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWE7WUFDekUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ2pDLENBQUM7Ozs7SUFtQkQsS0FBSztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hDLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7OztZQTFERixTQUFTOzs7O1lBb0NnQixjQUFjO1lBbE50QyxVQUFVOzRDQW1OTCxRQUFRLFlBQUksTUFBTSxTQUFDLHlCQUF5Qjt5Q0FDNUMsU0FBUyxTQUFDLFVBQVU7WUEzTG5CLFlBQVk7eUNBNExiLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7cUJBOUI1QyxLQUFLOzs7Ozs7OztJQUhOLG9DQUFxQzs7Ozs7Ozs7SUFrQnJDLHVDQUFpRDs7Ozs7SUFZN0MscUNBQWtDOztJQUFFLHFDQUE2Qjs7Ozs7SUFFeEIsd0NBQW1DOzs7OztBQXdDbEYsTUFBTSxPQUFPLFVBQVcsU0FBUSxlQUFlOzs7Ozs7Ozs7OztJQUk3QyxZQUNFLFNBQW9CLEVBQUUsVUFBc0IsRUFBRSxNQUFjLEVBQzVELFFBQWtCLEVBQzZCLG1CQUE2QyxFQUNyRSxRQUFnQixFQUFFLFlBQTBCLEVBQ3hCLGFBQXNCO1FBQ2pFLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNuRSxDQUFDOzs7O0lBRUQsV0FBVztRQUNULEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDN0MsQ0FBQzs7O1lBL0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsOEJBQThCO2dCQUN4QyxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUM7Z0JBQ2pELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsY0FBYztvQkFDdkIscUJBQXFCLEVBQUUsd0JBQXdCO29CQUMvQyxzQkFBc0IsRUFBRSxVQUFVO29CQUNsQyxpQkFBaUIsRUFBRSxVQUFVO29CQUM3QiwwQkFBMEIsRUFBRSxVQUFVO29CQUN0Qyw4QkFBOEIsRUFBRSxRQUFRO2lCQUN6QzthQUNGOzs7O1lBTWMsU0FBUztZQWpRdEIsVUFBVTtZQUlWLE1BQU07WUFmQSxRQUFROzRDQThRWCxRQUFRLFlBQUksTUFBTSxTQUFDLHlCQUF5Qjt5Q0FDNUMsU0FBUyxTQUFDLFVBQVU7WUEzT2pCLFlBQVk7eUNBNE9mLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7O0lBVzNDLHNDQUF1RTs7SUFDdkUsMkNBQTRFOzs7Ozs7SUFuQjVFLG9DQUF1QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBIYXNUYWJJbmRleCwgSGFzVGFiSW5kZXhDdG9yLFxuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzYWJsZU9wdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdElua0Jhcn0gZnJvbSAnLi4vaW5rLWJhcic7XG5pbXBvcnQge01hdFBhZ2luYXRlZFRhYkhlYWRlciwgTWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbX0gZnJvbSAnLi4vcGFnaW5hdGVkLXRhYi1oZWFkZXInO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJOYXZgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0VGFiTmF2QmFzZSBleHRlbmRzIE1hdFBhZ2luYXRlZFRhYkhlYWRlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG5cbiAgLyoqIFF1ZXJ5IGxpc3Qgb2YgYWxsIHRhYiBsaW5rcyBvZiB0aGUgdGFiIG5hdmlnYXRpb24uICovXG4gIGFic3RyYWN0IF9pdGVtczogUXVlcnlMaXN0PE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0gJiB7YWN0aXZlOiBib29sZWFufT47XG5cbiAgLyoqIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIHRhYiBuYXYuICovXG4gIEBJbnB1dCgpXG4gIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjsgfVxuICBzZXQgYmFja2dyb3VuZENvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWNrZ3JvdW5kLSR7dGhpcy5iYWNrZ3JvdW5kQ29sb3J9YCk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoYG1hdC1iYWNrZ3JvdW5kLSR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYmFja2dyb3VuZENvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYmFja2dyb3VuZENvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7IH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IGFueSkgeyB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBuYXYgYmFyLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIG5nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBwbGF0Zm9ybWAgcGFyYW1ldGVyIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHBsYXRmb3JtPzogUGxhdGZvcm0sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2l0ZW1TZWxlY3RlZCgpIHtcbiAgICAvLyBub29wXG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0aGlzIHRvIHJ1biBiZWZvcmUgdGhlIGBjaGFuZ2VzYCBzdWJzY3JpcHRpb24gaW4gcGFyZW50IHRvIGVuc3VyZSB0aGF0IHRoZVxuICAgIC8vIHNlbGVjdGVkSW5kZXggaXMgdXAtdG8tZGF0ZSBieSB0aGUgdGltZSB0aGUgc3VwZXIgY2xhc3Mgc3RhcnRzIGxvb2tpbmcgZm9yIGl0LlxuICAgIHRoaXMuX2l0ZW1zLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVBY3RpdmVMaW5rKCk7XG4gICAgfSk7XG5cbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZmllcyB0aGUgY29tcG9uZW50IHRoYXQgdGhlIGFjdGl2ZSBsaW5rIGhhcyBiZWVuIGNoYW5nZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYGVsZW1lbnRgIHBhcmFtZXRlciB0byBiZSByZW1vdmVkLlxuICAgKi9cbiAgdXBkYXRlQWN0aXZlTGluayhfZWxlbWVudD86IEVsZW1lbnRSZWYpIHtcbiAgICBpZiAoIXRoaXMuX2l0ZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9pdGVtcy50b0FycmF5KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlbXNbaV0uYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIGluayBiYXIgc2hvdWxkIGhpZGUgaXRzZWxmIGlmIG5vIGl0ZW1zIGFyZSBhY3RpdmUuXG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgdGhpcy5faW5rQmFyLmhpZGUoKTtcbiAgfVxufVxuXG5cbi8qKlxuICogTmF2aWdhdGlvbiBjb21wb25lbnQgbWF0Y2hpbmcgdGhlIHN0eWxlcyBvZiB0aGUgdGFiIGdyb3VwIGhlYWRlci5cbiAqIFByb3ZpZGVzIGFuY2hvcmVkIG5hdmlnYXRpb24gd2l0aCBhbmltYXRlZCBpbmsgYmFyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1uYXYtYmFyXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTmF2QmFyLCBtYXRUYWJOYXYnLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICd0YWItbmF2LWJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3RhYi1uYXYtYmFyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItbmF2LWJhciBtYXQtdGFiLWhlYWRlcicsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNvbnRyb2xzLWVuYWJsZWRdJzogJ19zaG93UGFnaW5hdGlvbkNvbnRyb2xzJyxcbiAgICAnW2NsYXNzLm1hdC10YWItaGVhZGVyLXJ0bF0nOiBcIl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PSAncnRsJ1wiLFxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yICE9PSBcIndhcm5cIiAmJiBjb2xvciAhPT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciA9PT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT09IFwid2FyblwiJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJOYXYgZXh0ZW5kcyBfTWF0VGFiTmF2QmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRUYWJMaW5rKSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0VGFiTGluaz47XG4gIEBWaWV3Q2hpbGQoTWF0SW5rQmFyLCB7c3RhdGljOiB0cnVlfSkgX2lua0JhcjogTWF0SW5rQmFyO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0Q29udGFpbmVyJywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0Q29udGFpbmVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0Jywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCduZXh0UGFnaW5hdG9yJykgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwcmV2aW91c1BhZ2luYXRvcicpIF9wcmV2aW91c1BhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYHBsYXRmb3JtYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpIHBsYXRmb3JtPzogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkaXIsIG5nWm9uZSwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIHBsYXRmb3JtLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiTGluay5cbmNsYXNzIE1hdFRhYkxpbmtNaXhpbkJhc2Uge31cbmNvbnN0IF9NYXRUYWJMaW5rTWl4aW5CYXNlOlxuICAgIEhhc1RhYkluZGV4Q3RvciAmIENhbkRpc2FibGVSaXBwbGVDdG9yICYgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0VGFiTGlua01peGluQmFzZSA9XG4gICAgICAgIG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoTWF0VGFiTGlua01peGluQmFzZSkpKTtcblxuLyoqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJMaW5rYCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGNsYXNzIF9NYXRUYWJMaW5rQmFzZSBleHRlbmRzIF9NYXRUYWJMaW5rTWl4aW5CYXNlIGltcGxlbWVudHMgT25EZXN0cm95LCBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLCBIYXNUYWJJbmRleCwgUmlwcGxlVGFyZ2V0LCBGb2N1c2FibGVPcHRpb24ge1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGluayBpcyBhY3RpdmUgb3Igbm90LiAqL1xuICBwcm90ZWN0ZWQgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpbmsgaXMgYWN0aXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faXNBY3RpdmU7IH1cbiAgc2V0IGFjdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gdmFsdWU7XG4gICAgICB0aGlzLl90YWJOYXZCYXIudXBkYXRlQWN0aXZlTGluayh0aGlzLmVsZW1lbnRSZWYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uIFRoZSByaXBwbGUgY29uZmlnXG4gICAqIGlzIHNldCB0byB0aGUgZ2xvYmFsIHJpcHBsZSBvcHRpb25zIHNpbmNlIHdlIGRvbid0IGhhdmUgYW55IGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvclxuICAgKiB0aGUgdGFiIGxpbmsgcmlwcGxlcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkIG9uIGludGVyYWN0aW9uLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuX3RhYk5hdkJhci5kaXNhYmxlUmlwcGxlIHx8XG4gICAgICAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF90YWJOYXZCYXI6IF9NYXRUYWJOYXZCYXNlLCBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUykgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9uc3xudWxsLFxuICAgICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLCBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5yaXBwbGVDb25maWcuYW5pbWF0aW9uID0ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH07XG4gICAgfVxuXG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLmVsZW1lbnRSZWYpO1xuICB9XG59XG5cblxuLyoqXG4gKiBMaW5rIGluc2lkZSBvZiBhIGBtYXQtdGFiLW5hdi1iYXJgLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1saW5rXSwgW21hdFRhYkxpbmtdJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJMaW5rJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWxpbmsnLFxuICAgICdbYXR0ci5hcmlhLWN1cnJlbnRdJzogJ2FjdGl2ZSA/IFwicGFnZVwiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIudGFiSW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2NsYXNzLm1hdC10YWItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC10YWItbGFiZWwtYWN0aXZlXSc6ICdhY3RpdmUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkxpbmsgZXh0ZW5kcyBfTWF0VGFiTGlua0Jhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBSaXBwbGVSZW5kZXJlciBmb3IgdGhlIHRhYi1saW5rLiAqL1xuICBwcml2YXRlIF90YWJMaW5rUmlwcGxlOiBSaXBwbGVSZW5kZXJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0YWJOYXZCYXI6IE1hdFRhYk5hdiwgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgbmdab25lOiBOZ1pvbmUsXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUykgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9uc3xudWxsLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZywgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcih0YWJOYXZCYXIsIGVsZW1lbnRSZWYsIGdsb2JhbFJpcHBsZU9wdGlvbnMsIHRhYkluZGV4LCBmb2N1c01vbml0b3IsIGFuaW1hdGlvbk1vZGUpO1xuICAgIHRoaXMuX3RhYkxpbmtSaXBwbGUgPSBuZXcgUmlwcGxlUmVuZGVyZXIodGhpcywgbmdab25lLCBlbGVtZW50UmVmLCBwbGF0Zm9ybSk7XG4gICAgdGhpcy5fdGFiTGlua1JpcHBsZS5zZXR1cFRyaWdnZXJFdmVudHMoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fdGFiTGlua1JpcHBsZS5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuIl19