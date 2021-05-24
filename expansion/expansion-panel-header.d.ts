/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { HasTabIndex } from '@angular/material/core';
import { NumberInput } from '@angular/cdk/coercion';
import { MatAccordionTogglePosition } from './accordion-base';
import { MatExpansionPanel, MatExpansionPanelDefaultOptions } from './expansion-panel';
/** @docs-private */
declare abstract class MatExpansionPanelHeaderBase {
    abstract readonly disabled: boolean;
}
declare const _MatExpansionPanelHeaderMixinBase: import("@angular/material/core/common-behaviors/constructor").Constructor<HasTabIndex> & import("@angular/material/core/common-behaviors/constructor").AbstractConstructor<HasTabIndex> & typeof MatExpansionPanelHeaderBase;
/**
 * Header element of a `<mat-expansion-panel>`.
 */
export declare class MatExpansionPanelHeader extends _MatExpansionPanelHeaderMixinBase implements AfterViewInit, OnDestroy, FocusableOption, HasTabIndex {
    panel: MatExpansionPanel;
    private _element;
    private _focusMonitor;
    private _changeDetectorRef;
    _animationMode?: string | undefined;
    private _parentChangeSubscription;
    constructor(panel: MatExpansionPanel, _element: ElementRef, _focusMonitor: FocusMonitor, _changeDetectorRef: ChangeDetectorRef, defaultOptions?: MatExpansionPanelDefaultOptions, _animationMode?: string | undefined, tabIndex?: string);
    /** Height of the header while the panel is expanded. */
    expandedHeight: string;
    /** Height of the header while the panel is collapsed. */
    collapsedHeight: string;
    /**
     * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
     * @docs-private
     */
    get disabled(): boolean;
    /** Toggles the expanded state of the panel. */
    _toggle(): void;
    /** Gets whether the panel is expanded. */
    _isExpanded(): boolean;
    /** Gets the expanded state string of the panel. */
    _getExpandedState(): string;
    /** Gets the panel id. */
    _getPanelId(): string;
    /** Gets the toggle position for the header. */
    _getTogglePosition(): MatAccordionTogglePosition;
    /** Gets whether the expand indicator should be shown. */
    _showToggle(): boolean;
    /**
     * Gets the current height of the header. Null if no custom height has been
     * specified, and if the default height from the stylesheet should be used.
     */
    _getHeaderHeight(): string | null;
    /** Handle keydown event calling to toggle() if appropriate. */
    _keydown(event: KeyboardEvent): void;
    /**
     * Focuses the panel header. Implemented as a part of `FocusableOption`.
     * @param origin Origin of the action that triggered the focus.
     * @docs-private
     */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ngAcceptInputType_tabIndex: NumberInput;
}
/**
 * Description element of a `<mat-expansion-panel-header>`.
 */
export declare class MatExpansionPanelDescription {
}
/**
 * Title element of a `<mat-expansion-panel-header>`.
 */
export declare class MatExpansionPanelTitle {
}
export {};
