/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef, AfterContentInit } from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CanDisable } from '@angular/material/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs/Subject';
import { MatAccordion } from './accordion';
import { MatExpansionPanelContent } from './expansion-panel-content';
/** @docs-private */
export declare class MatExpansionPanelBase extends CdkAccordionItem {
    constructor(accordion: MatAccordion, _changeDetectorRef: ChangeDetectorRef, _uniqueSelectionDispatcher: UniqueSelectionDispatcher);
}
export declare const _MatExpansionPanelMixinBase: (new (...args: any[]) => CanDisable) & typeof MatExpansionPanelBase;
/** MatExpansionPanel's states. */
export declare type MatExpansionPanelState = 'expanded' | 'collapsed';
/**
 * <mat-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
export declare class MatExpansionPanel extends _MatExpansionPanelMixinBase implements CanDisable, AfterContentInit, OnChanges, OnDestroy {
    private _viewContainerRef;
    /** Whether the toggle indicator should be hidden. */
    hideToggle: boolean;
    private _hideToggle;
    /** Stream that emits for changes in `@Input` properties. */
    _inputChanges: Subject<SimpleChanges>;
    /** Optionally defined accordion the expansion panel belongs to. */
    accordion: MatAccordion;
    /** Content that will be rendered lazily. */
    _lazyContent: MatExpansionPanelContent;
    /** Portal holding the user's content. */
    _portal: TemplatePortal<any>;
    constructor(accordion: MatAccordion, _changeDetectorRef: ChangeDetectorRef, _uniqueSelectionDispatcher: UniqueSelectionDispatcher, _viewContainerRef: ViewContainerRef);
    /** Whether the expansion indicator should be hidden. */
    _getHideToggle(): boolean;
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    _hasSpacing(): boolean;
    /** Gets the expanded state string. */
    _getExpandedState(): MatExpansionPanelState;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
export declare class MatExpansionPanelActionRow {
}
