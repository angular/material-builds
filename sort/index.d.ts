import { AfterViewInit } from '@angular/core';
import { AnimationTriggerMetadata } from '@angular/animations';
import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { WritableSignal } from '@angular/core';

/**
 * Valid positions for the arrow to be in for its opacity and translation. If the state is a
 * sort direction, the position of the arrow will be above/below and opacity 0. If the state is
 * hint, the arrow will be in the center with a slight opacity. Active state means the arrow will
 * be fully opaque in the center.
 *
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export declare type ArrowViewState = SortDirection | 'hint' | 'active';

/**
 * States describing the arrow's animated position (animating fromState to toState).
 * If the fromState is not defined, there will be no animated transition to the toState.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export declare interface ArrowViewStateTransition {
    fromState?: ArrowViewState;
    toState?: ArrowViewState;
}

declare namespace i2 {
    export {
        SortHeaderArrowPosition,
        MatSortable,
        Sort,
        MatSortDefaultOptions,
        MAT_SORT_DEFAULT_OPTIONS,
        MatSort
    }
}

declare namespace i3 {
    export {
        ArrowViewState,
        ArrowViewStateTransition,
        MatSortHeader
    }
}

/** Injection token to be used to override the default options for `mat-sort`. */
export declare const MAT_SORT_DEFAULT_OPTIONS: InjectionToken<MatSortDefaultOptions>;

/** @docs-private */
export declare const MAT_SORT_HEADER_INTL_PROVIDER: {
    provide: typeof MatSortHeaderIntl;
    deps: Optional[][];
    useFactory: typeof MAT_SORT_HEADER_INTL_PROVIDER_FACTORY;
};

/** @docs-private */
export declare function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl: MatSortHeaderIntl): MatSortHeaderIntl;

/** Container for MatSortables to manage the sort state and provide default sort parameters. */
export declare class MatSort implements OnChanges, OnDestroy, OnInit {
    private _defaultOptions?;
    private _initializedStream;
    /** Collection of all registered sortables that this directive manages. */
    sortables: Map<string, MatSortable>;
    /** Used to notify any child components listening to state changes. */
    readonly _stateChanges: Subject<void>;
    /** The id of the most recently sorted MatSortable. */
    active: string;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overridden by the MatSortable's sort start.
     */
    start: SortDirection;
    /** The sort direction of the currently active MatSortable. */
    get direction(): SortDirection;
    set direction(direction: SortDirection);
    private _direction;
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overridden by the MatSortable's disable clear input.
     */
    disableClear: boolean;
    /** Whether the sortable is disabled. */
    disabled: boolean;
    /** Event emitted when the user changes either the active sort or sort direction. */
    readonly sortChange: EventEmitter<Sort>;
    /** Emits when the paginator is initialized. */
    initialized: Observable<void>;
    constructor(_defaultOptions?: MatSortDefaultOptions | undefined);
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     */
    register(sortable: MatSortable): void;
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     */
    deregister(sortable: MatSortable): void;
    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable: MatSortable): void;
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable: MatSortable): SortDirection;
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSort, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSort, "[matSort]", ["matSort"], { "active": { "alias": "matSortActive"; "required": false; }; "start": { "alias": "matSortStart"; "required": false; }; "direction": { "alias": "matSortDirection"; "required": false; }; "disableClear": { "alias": "matSortDisableClear"; "required": false; }; "disabled": { "alias": "matSortDisabled"; "required": false; }; }, { "sortChange": "matSortChange"; }, never, never, true, never>;
    static ngAcceptInputType_disableClear: unknown;
    static ngAcceptInputType_disabled: unknown;
}

/** Interface for a directive that holds sorting state consumed by `MatSortHeader`. */
export declare interface MatSortable {
    /** The id of the column being sorted. */
    id: string;
    /** Starting sort direction. */
    start: SortDirection;
    /** Whether to disable clearing the sorting state. */
    disableClear: boolean;
}

/**
 * Animations used by MatSort.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export declare const matSortAnimations: {
    readonly indicator: AnimationTriggerMetadata;
    readonly leftPointer: AnimationTriggerMetadata;
    readonly rightPointer: AnimationTriggerMetadata;
    readonly arrowOpacity: AnimationTriggerMetadata;
    readonly arrowPosition: AnimationTriggerMetadata;
    readonly allowChildren: AnimationTriggerMetadata;
};

/** Default options for `mat-sort`.  */
export declare interface MatSortDefaultOptions {
    /** Whether to disable clearing the sorting state. */
    disableClear?: boolean;
    /** Position of the arrow that displays when sorted. */
    arrowPosition?: SortHeaderArrowPosition;
}

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
export declare class MatSortHeader implements MatSortable, OnDestroy, OnInit, AfterViewInit {
    _intl: MatSortHeaderIntl;
    _sort: MatSort;
    _columnDef: MatSortHeaderColumnDef | null;
    private _changeDetectorRef;
    private _focusMonitor;
    private _elementRef;
    private _ariaDescriber;
    private _renderChanges;
    protected _animationModule: "NoopAnimations" | "BrowserAnimations" | null;
    /**
     * Indicates which state was just cleared from the sort header.
     * Will be reset on the next interaction. Used for coordinating animations.
     */
    protected _recentlyCleared: WritableSignal<SortDirection | null>;
    /**
     * The element with role="button" inside this component's view. We need this
     * in order to apply a description with AriaDescriber.
     */
    private _sortButton;
    /**
     * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
     * the column's name.
     */
    id: string;
    /** Sets the position of the arrow that displays when sorted. */
    arrowPosition: SortHeaderArrowPosition;
    /** Overrides the sort start value of the containing MatSort for this MatSortable. */
    start: SortDirection;
    /** whether the sort header is disabled. */
    disabled: boolean;
    /**
     * Description applied to MatSortHeader's button element with aria-describedby. This text should
     * describe the action that will occur when the user clicks the sort header.
     */
    get sortActionDescription(): string;
    set sortActionDescription(value: string);
    private _sortActionDescription;
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    disableClear: boolean;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Triggers the sort on this sort header and removes the indicator hint. */
    _toggleOnInteraction(): void;
    _handleKeydown(event: KeyboardEvent): void;
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    _isSorted(): boolean;
    _isDisabled(): boolean;
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     */
    _getAriaSortAttribute(): "none" | "ascending" | "descending";
    /** Whether the arrow inside the sort header should be rendered. */
    _renderArrow(): boolean;
    private _updateSortActionDescription;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSortHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSortHeader, "[mat-sort-header]", ["matSortHeader"], { "id": { "alias": "mat-sort-header"; "required": false; }; "arrowPosition": { "alias": "arrowPosition"; "required": false; }; "start": { "alias": "start"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "sortActionDescription": { "alias": "sortActionDescription"; "required": false; }; "disableClear": { "alias": "disableClear"; "required": false; }; }, {}, never, ["*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_disableClear: unknown;
}

/** Column definition associated with a `MatSortHeader`. */
declare interface MatSortHeaderColumnDef {
    name: string;
}

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
export declare class MatSortHeaderIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    readonly changes: Subject<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSortHeaderIntl, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatSortHeaderIntl>;
}

export declare class MatSortModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSortModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatSortModule, never, [typeof i1.MatCommonModule, typeof i2.MatSort, typeof i3.MatSortHeader], [typeof i2.MatSort, typeof i3.MatSortHeader]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatSortModule>;
}

/** The current sort state. */
export declare interface Sort {
    /** The id of the column being sorted. */
    active: string;
    /** The sort direction. */
    direction: SortDirection;
}


export declare type SortDirection = 'asc' | 'desc' | '';

/** Position of the arrow that displays when sorted. */
export declare type SortHeaderArrowPosition = 'before' | 'after';

export { }
