import { AnimationEvent as AnimationEvent_2 } from '@angular/animations';
import { AnimationTriggerMetadata } from '@angular/animations';
import { BasePortalOutlet } from '@angular/cdk/portal';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { Direction } from '@angular/cdk/bidi';
import { DomPortal } from '@angular/cdk/portal';
import { ElementRef } from '@angular/core';
import { EmbeddedViewRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import * as i2 from '@angular/cdk/overlay';
import * as i3 from '@angular/material/core';
import * as i4 from '@angular/cdk/portal';
import { InjectionToken } from '@angular/core';
import { Injector } from '@angular/core';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayRef } from '@angular/cdk/overlay';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TemplateRef } from '@angular/core';
import { ViewContainerRef } from '@angular/core';

/** Options for where to set focus to automatically on dialog open */
export declare type AutoFocusTarget = 'dialog' | 'first-tabbable' | 'first-heading';

declare namespace i1 {
    export {
        MatBottomSheetContainer
    }
}

/** Injection token that can be used to access the data that was passed in to a bottom sheet. */
export declare const MAT_BOTTOM_SHEET_DATA: InjectionToken<any>;

/** Injection token that can be used to specify default bottom sheet options. */
export declare const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS: InjectionToken<MatBottomSheetConfig<any>>;

/**
 * Service to trigger Material Design bottom sheets.
 */
export declare class MatBottomSheet implements OnDestroy {
    private _overlay;
    private _injector;
    private _parentBottomSheet;
    private _defaultOptions?;
    private _bottomSheetRefAtThisLevel;
    /** Reference to the currently opened bottom sheet. */
    get _openedBottomSheetRef(): MatBottomSheetRef<any> | null;
    set _openedBottomSheetRef(value: MatBottomSheetRef<any> | null);
    constructor(_overlay: Overlay, _injector: Injector, _parentBottomSheet: MatBottomSheet, _defaultOptions?: MatBottomSheetConfig<any> | undefined);
    /**
     * Opens a bottom sheet containing the given component.
     * @param component Type of the component to load into the bottom sheet.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened bottom sheet.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, R>;
    /**
     * Opens a bottom sheet containing the given template.
     * @param template TemplateRef to instantiate as the bottom sheet content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened bottom sheet.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, R>;
    /**
     * Dismisses the currently-visible bottom sheet.
     * @param result Data to pass to the bottom sheet instance.
     */
    dismiss<R = any>(result?: R): void;
    ngOnDestroy(): void;
    /**
     * Attaches the bottom sheet container component to the overlay.
     */
    private _attachContainer;
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified bottom sheet config.
     */
    private _createOverlay;
    /**
     * Creates an injector to be used inside of a bottom sheet component.
     * @param config Config that was used to create the bottom sheet.
     * @param bottomSheetRef Reference to the bottom sheet.
     */
    private _createInjector;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheet, [null, null, { optional: true; skipSelf: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatBottomSheet>;
}

/** Animations used by the Material bottom sheet. */
export declare const matBottomSheetAnimations: {
    readonly bottomSheetState: AnimationTriggerMetadata;
};

/**
 * Configuration used when opening a bottom sheet.
 */
export declare class MatBottomSheetConfig<D = any> {
    /** The view container to place the overlay for the bottom sheet into. */
    viewContainerRef?: ViewContainerRef;
    /** Extra CSS classes to be added to the bottom sheet container. */
    panelClass?: string | string[];
    /** Text layout direction for the bottom sheet. */
    direction?: Direction;
    /** Data being injected into the child component. */
    data?: D | null;
    /** Whether the bottom sheet has a backdrop. */
    hasBackdrop?: boolean;
    /** Custom class for the backdrop. */
    backdropClass?: string;
    /** Whether the user can use escape or clicking outside to close the bottom sheet. */
    disableClose?: boolean;
    /** Aria label to assign to the bottom sheet element. */
    ariaLabel?: string | null;
    /**
     * Whether the bottom sheet should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     */
    closeOnNavigation?: boolean;
    /**
     * Where the bottom sheet should focus on open.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
     * AutoFocusTarget instead.
     */
    autoFocus?: AutoFocusTarget | string | boolean;
    /**
     * Whether the bottom sheet should restore focus to the
     * previously-focused element, after it's closed.
     */
    restoreFocus?: boolean;
    /** Scroll strategy to be used for the bottom sheet. */
    scrollStrategy?: ScrollStrategy;
}

/**
 * Internal component that wraps user-provided bottom sheet content.
 * @docs-private
 */
export declare class MatBottomSheetContainer extends BasePortalOutlet implements OnDestroy {
    private _elementRef;
    private _changeDetectorRef;
    private _focusTrapFactory;
    private readonly _interactivityChecker;
    private readonly _ngZone;
    /** The bottom sheet configuration. */
    bottomSheetConfig: MatBottomSheetConfig;
    private _breakpointSubscription;
    /** The portal outlet inside of this container into which the content will be loaded. */
    _portalOutlet: CdkPortalOutlet;
    /** The state of the bottom sheet animations. */
    _animationState: 'void' | 'visible' | 'hidden';
    /** Emits whenever the state of the animation changes. */
    _animationStateChanged: EventEmitter<AnimationEvent_2>;
    /** The class that traps and manages focus within the bottom sheet. */
    private _focusTrap;
    /** Element that was focused before the bottom sheet was opened. */
    private _elementFocusedBeforeOpened;
    /** Server-side rendering-compatible reference to the global document object. */
    private _document;
    /** Whether the component has been destroyed. */
    private _destroyed;
    constructor(_elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, _focusTrapFactory: FocusTrapFactory, _interactivityChecker: InteractivityChecker, _ngZone: NgZone, breakpointObserver: BreakpointObserver, document: any, 
    /** The bottom sheet configuration. */
    bottomSheetConfig: MatBottomSheetConfig);
    /** Attach a component portal as content to this bottom sheet container. */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** Attach a template portal as content to this bottom sheet container. */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;
    /**
     * Attaches a DOM portal to the bottom sheet container.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    attachDomPortal: (portal: DomPortal) => void;
    /** Begin animation of bottom sheet entrance into view. */
    enter(): void;
    /** Begin animation of the bottom sheet exiting from view. */
    exit(): void;
    ngOnDestroy(): void;
    _onAnimationDone(event: AnimationEvent_2): void;
    _onAnimationStart(event: AnimationEvent_2): void;
    private _toggleClass;
    private _validatePortalAttached;
    private _setPanelClass;
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    private _forceFocus;
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    private _focusByCssSelector;
    /**
     * Moves the focus inside the focus trap. When autoFocus is not set to 'bottom-sheet',
     * if focus cannot be moved then focus will go to the bottom sheet container.
     */
    private _trapFocus;
    /** Restores focus to the element that was focused before the bottom sheet was opened. */
    private _restoreFocus;
    /** Saves a reference to the element that was focused before the bottom sheet was opened. */
    private _savePreviouslyFocusedElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheetContainer, [null, null, null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatBottomSheetContainer, "mat-bottom-sheet-container", never, {}, {}, never, never, false>;
}

export declare class MatBottomSheetModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheetModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatBottomSheetModule, [typeof i1.MatBottomSheetContainer], [typeof i2.OverlayModule, typeof i3.MatCommonModule, typeof i4.PortalModule], [typeof i1.MatBottomSheetContainer, typeof i3.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatBottomSheetModule>;
}

/**
 * Reference to a bottom sheet dispatched from the bottom sheet service.
 */
export declare class MatBottomSheetRef<T = any, R = any> {
    private _overlayRef;
    /** Instance of the component making up the content of the bottom sheet. */
    instance: T;
    /**
     * Instance of the component into which the bottom sheet content is projected.
     * @docs-private
     */
    containerInstance: MatBottomSheetContainer;
    /** Whether the user is allowed to close the bottom sheet. */
    disableClose: boolean | undefined;
    /** Subject for notifying the user that the bottom sheet has been dismissed. */
    private readonly _afterDismissed;
    /** Subject for notifying the user that the bottom sheet has opened and appeared. */
    private readonly _afterOpened;
    /** Result to be passed down to the `afterDismissed` stream. */
    private _result;
    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    private _closeFallbackTimeout;
    constructor(containerInstance: MatBottomSheetContainer, _overlayRef: OverlayRef);
    /**
     * Dismisses the bottom sheet.
     * @param result Data to be passed back to the bottom sheet opener.
     */
    dismiss(result?: R): void;
    /** Gets an observable that is notified when the bottom sheet is finished closing. */
    afterDismissed(): Observable<R | undefined>;
    /** Gets an observable that is notified when the bottom sheet has opened and appeared. */
    afterOpened(): Observable<void>;
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick(): Observable<MouseEvent>;
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents(): Observable<KeyboardEvent>;
}

export { }
