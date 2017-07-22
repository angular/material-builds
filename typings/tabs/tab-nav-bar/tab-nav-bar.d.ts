/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, NgZone, OnDestroy, Renderer2, ChangeDetectorRef } from '@angular/core';
import { MdInkBar } from '../ink-bar';
import { CanDisable } from '../../core/common-behaviors/disabled';
import { ViewportRuler } from '../../core/overlay/position/viewport-ruler';
import { Directionality, Platform, RippleGlobalOptions } from '../../core';
import { CanColor, ThemePalette } from '../../core/common-behaviors/color';
/** @docs-private */
export declare class MdTabNavBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdTabNavMixinBase: (new (...args: any[]) => CanColor) & typeof MdTabNavBase;
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export declare class MdTabNav extends _MdTabNavMixinBase implements AfterContentInit, CanColor, OnDestroy {
    private _dir;
    private _ngZone;
    private _changeDetectorRef;
    /** Subject that emits when the component has been destroyed. */
    private _onDestroy;
    _activeLinkChanged: boolean;
    _activeLinkElement: ElementRef;
    _inkBar: MdInkBar;
    /** Subscription for window.resize event **/
    private _resizeSubscription;
    /** Background color of the tab nav. */
    backgroundColor: ThemePalette;
    private _backgroundColor;
    constructor(renderer: Renderer2, elementRef: ElementRef, _dir: Directionality, _ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    /** Notifies the component that the active link has been changed. */
    updateActiveLink(element: ElementRef): void;
    ngAfterContentInit(): void;
    /** Checks if the active link has been changed and, if so, will update the ink bar. */
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    /** Aligns the ink bar to the active link. */
    _alignInkBar(): void;
}
export declare class MdTabLinkBase {
}
export declare const _MdTabLinkMixinBase: (new (...args: any[]) => CanDisable) & typeof MdTabLinkBase;
/**
 * Link inside of a `md-tab-nav-bar`.
 */
export declare class MdTabLink extends _MdTabLinkMixinBase implements OnDestroy, CanDisable {
    private _mdTabNavBar;
    private _elementRef;
    /** Whether the tab link is active or not. */
    private _isActive;
    /** Reference to the instance of the ripple for the tab link. */
    private _tabLinkRipple;
    /** Whether the link is active. */
    active: boolean;
    /** @docs-private */
    readonly tabIndex: number;
    constructor(_mdTabNavBar: MdTabNav, _elementRef: ElementRef, ngZone: NgZone, ruler: ViewportRuler, platform: Platform, globalOptions: RippleGlobalOptions);
    ngOnDestroy(): void;
}
