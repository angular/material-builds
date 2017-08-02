/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, QueryList, EventEmitter, Renderer2, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { Directionality } from '../core';
import { FocusTrapFactory } from '../core/a11y/focus-trap';
/** Throws an exception when two MdSidenav are matching the same side. */
export declare function throwMdDuplicatedSidenavError(align: string): void;
/**
 * Sidenav toggle promise result.
 * @deprecated
 */
export declare class MdSidenavToggleResult {
    type: 'open' | 'close';
    animationFinished: boolean;
    constructor(type: 'open' | 'close', animationFinished: boolean);
}
/**
 * <md-sidenav> component.
 *
 * This component corresponds to the drawer of the sidenav.
 *
 * Please refer to README.md for examples on how to use it.
 */
export declare class MdSidenav implements AfterContentInit, OnDestroy {
    private _elementRef;
    private _focusTrapFactory;
    private _doc;
    private _focusTrap;
    private _elementFocusedBeforeSidenavWasOpened;
    /** Whether the sidenav is initialized. Used for disabling the initial animation. */
    private _enableAnimations;
    /** Alignment of the sidenav (direction neutral); whether 'start' or 'end'. */
    private _align;
    /** Direction which the sidenav is aligned in. */
    align: "start" | "end";
    /** Mode of the sidenav; one of 'over', 'push' or 'side'. */
    mode: 'over' | 'push' | 'side';
    /** Whether the sidenav can be closed with the escape key or not. */
    disableClose: boolean;
    private _disableClose;
    /** Whether the sidenav is opened. */
    private _opened;
    /** Emits whenever the sidenav has started animating. */
    _animationStarted: EventEmitter<void>;
    /** Whether the sidenav is animating. Used to prevent overlapping animations. */
    _isAnimating: boolean;
    /**
     * Promise that resolves when the open/close animation completes. It is here for backwards
     * compatibility and should be removed next time we do sidenav breaking changes.
     * @deprecated
     */
    private _currentTogglePromise;
    /** Event emitted when the sidenav is fully opened. */
    onOpen: EventEmitter<void | MdSidenavToggleResult>;
    /** Event emitted when the sidenav is fully closed. */
    onClose: EventEmitter<void | MdSidenavToggleResult>;
    /** Event emitted when the sidenav alignment changes. */
    onAlignChanged: EventEmitter<void>;
    readonly isFocusTrapEnabled: boolean;
    constructor(_elementRef: ElementRef, _focusTrapFactory: FocusTrapFactory, _doc: any);
    /**
     * If focus is currently inside the sidenav, restores it to where it was before the sidenav
     * opened.
     */
    private _restoreFocus();
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Whether the sidenav is opened. We overload this because we trigger an event when it
     * starts or end.
     */
    opened: boolean;
    /**  Open the sidenav. */
    open(): Promise<MdSidenavToggleResult>;
    /** Close the sidenav. */
    close(): Promise<MdSidenavToggleResult>;
    /**
     * Toggle this sidenav.
     * @param isOpen Whether the sidenav should be open.
     */
    toggle(isOpen?: boolean): Promise<MdSidenavToggleResult>;
    /**
     * Handles the keyboard events.
     * @docs-private
     */
    handleKeydown(event: KeyboardEvent): void;
    /**
     * Figures out the state of the sidenav animation.
     */
    _getAnimationState(): 'open-instant' | 'open' | 'void';
    _onAnimationStart(): void;
    _onAnimationEnd(event: AnimationEvent): void;
    readonly _width: any;
}
/**
 * <md-sidenav-container> component.
 *
 * This is the parent component to one or two <md-sidenav>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export declare class MdSidenavContainer implements AfterContentInit {
    private _dir;
    private _element;
    private _renderer;
    private _ngZone;
    private _changeDetectorRef;
    _sidenavs: QueryList<MdSidenav>;
    /** The sidenav child with the `start` alignment. */
    readonly start: MdSidenav | null;
    /** The sidenav child with the `end` alignment. */
    readonly end: MdSidenav | null;
    /** Event emitted when the sidenav backdrop is clicked. */
    backdropClick: EventEmitter<void>;
    /** The sidenav at the start/end alignment, independent of direction. */
    private _start;
    private _end;
    /**
     * The sidenav at the left/right. When direction changes, these will change as well.
     * They're used as aliases for the above to set the left/right style properly.
     * In LTR, _left == _start and _right == _end.
     * In RTL, _left == _end and _right == _start.
     */
    private _left;
    private _right;
    /** Inline styles to be applied to the container. */
    _styles: {
        marginLeft: string;
        marginRight: string;
        transform: string;
    };
    constructor(_dir: Directionality, _element: ElementRef, _renderer: Renderer2, _ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    /** Calls `open` of both start and end sidenavs */
    open(): void;
    /** Calls `close` of both start and end sidenavs */
    close(): void;
    /**
     * Subscribes to sidenav events in order to set a class on the main container element when the
     * sidenav is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     */
    private _watchSidenavToggle(sidenav);
    /**
     * Subscribes to sidenav onAlignChanged event in order to re-validate drawers when the align
     * changes.
     */
    private _watchSidenavAlign(sidenav);
    /** Toggles the 'mat-sidenav-opened' class on the main 'md-sidenav-container' element. */
    private _setContainerClass(isAdd);
    /** Validate the state of the sidenav children components. */
    private _validateDrawers();
    _onBackdropClicked(): void;
    _closeModalSidenav(): void;
    _isShowingBackdrop(): boolean;
    private _isSidenavOpen(side);
    /**
     * Return the width of the sidenav, if it's in the proper mode and opened.
     * This may relayout the view, so do not call this often.
     * @param sidenav
     * @param mode
     */
    private _getSidenavEffectiveWidth(sidenav, mode);
    /**
     * Recalculates and updates the inline styles. Note that this
     * should be used sparingly, because it causes a reflow.
     */
    private _updateStyles();
}
