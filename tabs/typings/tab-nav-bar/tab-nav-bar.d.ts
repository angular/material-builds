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
import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, QueryList } from '@angular/core';
import { CanDisable, CanDisableCtor, CanDisableRipple, CanDisableRippleCtor, HasTabIndex, HasTabIndexCtor, RippleConfig, RippleGlobalOptions, RippleRenderer, RippleTarget, ThemePalette } from '@angular/material/core';
import { FocusMonitor, FocusableOption } from '@angular/cdk/a11y';
import { MatInkBar } from '../ink-bar';
import { MatPaginatedTabHeader } from '../paginated-tab-header';
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export declare class MatTabNav extends MatPaginatedTabHeader implements AfterContentChecked, AfterContentInit, OnDestroy {
    /** Query list of all tab links of the tab navigation. */
    _items: QueryList<MatTabLink>;
    _inkBar: MatInkBar;
    _tabListContainer: ElementRef;
    _tabList: ElementRef;
    _nextPaginator: ElementRef<HTMLElement>;
    _previousPaginator: ElementRef<HTMLElement>;
    /** Background color of the tab nav. */
    backgroundColor: ThemePalette;
    private _backgroundColor;
    /** Whether the ripple effect is disabled or not. */
    disableRipple: any;
    private _disableRipple;
    /** Theme color of the nav bar. */
    color: ThemePalette;
    constructor(elementRef: ElementRef, dir: Directionality, ngZone: NgZone, changeDetectorRef: ChangeDetectorRef, viewportRuler: ViewportRuler, 
    /**
     * @deprecated @breaking-change 9.0.0 `platform` parameter to become required.
     */
    platform?: Platform, animationMode?: string);
    protected _itemSelected(): void;
    ngAfterContentInit(): void;
    /**
     * Notifies the component that the active link has been changed.
     * @breaking-change 8.0.0 `element` parameter to be removed.
     */
    updateActiveLink(_element?: ElementRef): void;
}
declare class MatTabLinkBase {
}
declare const _MatTabLinkMixinBase: HasTabIndexCtor & CanDisableRippleCtor & CanDisableCtor & typeof MatTabLinkBase;
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
export declare class MatTabLink extends _MatTabLinkMixinBase implements OnDestroy, CanDisable, CanDisableRipple, HasTabIndex, RippleTarget, FocusableOption {
    private _tabNavBar;
    elementRef: ElementRef;
    private _focusMonitor;
    /** Whether the tab link is active or not. */
    protected _isActive: boolean;
    /** Reference to the RippleRenderer for the tab-link. */
    protected _tabLinkRipple: RippleRenderer;
    /** Whether the link is active. */
    active: boolean;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the tab link ripples.
     * @docs-private
     */
    rippleConfig: RippleConfig & RippleGlobalOptions;
    /**
     * Whether ripples are disabled on interaction.
     * @docs-private
     */
    readonly rippleDisabled: boolean;
    constructor(_tabNavBar: MatTabNav, elementRef: ElementRef, ngZone: NgZone, platform: Platform, globalRippleOptions: RippleGlobalOptions | null, tabIndex: string, _focusMonitor: FocusMonitor, animationMode?: string);
    focus(): void;
    ngOnDestroy(): void;
}
export {};
