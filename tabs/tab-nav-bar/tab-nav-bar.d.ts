import { ElementRef, NgZone, OnDestroy } from '@angular/core';
import { MdInkBar } from '../ink-bar';
import { MdRipple } from '../../core/ripple/ripple';
import { ViewportRuler } from '../../core/overlay/position/viewport-ruler';
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export declare class MdTabNavBar {
    _inkBar: MdInkBar;
    /** Animates the ink bar to the position of the active link element. */
    updateActiveLink(element: HTMLElement): void;
}
/**
 * Link inside of a `md-tab-nav-bar`.
 */
export declare class MdTabLink {
    private _mdTabNavBar;
    private _element;
    private _isActive;
    /** Whether the link is active. */
    active: boolean;
    constructor(_mdTabNavBar: MdTabNavBar, _element: ElementRef);
}
/**
 * Simple directive that extends the ripple and matches the selector of the MdTabLink. This
 * adds the ripple behavior to nav bar labels.
 */
export declare class MdTabLinkRipple extends MdRipple implements OnDestroy {
    private _element;
    private _ngZone;
    constructor(_element: ElementRef, _ngZone: NgZone, _ruler: ViewportRuler);
    /**
     * In certain cases the parent destroy handler may not get called. See Angular issue #11606.
     */
    ngOnDestroy(): void;
}
