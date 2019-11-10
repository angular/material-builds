/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, QueryList, ElementRef, NgZone } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from './drawer';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
export declare class MatSidenavContent extends MatDrawerContent {
    constructor(changeDetectorRef: ChangeDetectorRef, container: MatSidenavContainer, elementRef: ElementRef<HTMLElement>, scrollDispatcher: ScrollDispatcher, ngZone: NgZone);
}
export declare class MatSidenav extends MatDrawer {
    /** Whether the sidenav is fixed in the viewport. */
    fixedInViewport: boolean;
    private _fixedInViewport;
    /**
     * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
     * mode.
     */
    fixedTopGap: number;
    private _fixedTopGap;
    /**
     * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
     * fixed mode.
     */
    fixedBottomGap: number;
    private _fixedBottomGap;
    static ngAcceptInputType_fixedInViewport: boolean | string | null | undefined;
    static ngAcceptInputType_fixedTopGap: number | string | null | undefined;
    static ngAcceptInputType_fixedBottomGap: number | string | null | undefined;
    static ngAcceptInputType_disableClose: boolean | string | null | undefined;
    static ngAcceptInputType_autoFocus: boolean | string | null | undefined;
    static ngAcceptInputType_opened: boolean | string | null | undefined;
}
export declare class MatSidenavContainer extends MatDrawerContainer {
    _allDrawers: QueryList<MatSidenav>;
    _content: MatSidenavContent;
    static ngAcceptInputType_autosize: boolean | string | null | undefined;
    static ngAcceptInputType_hasBackdrop: boolean | string | null | undefined;
}
