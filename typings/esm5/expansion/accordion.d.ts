/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SimpleChanges } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import { Subject } from 'rxjs';
/** MatAccordion's display modes. */
export declare type MatAccordionDisplayMode = 'default' | 'flat';
/** MatAccordion's toggle positions. */
export declare type MatAccordionTogglePosition = 'before' | 'after';
/**
 * Directive for a Material Design Accordion.
 */
export declare class MatAccordion extends CdkAccordion {
    /** Stream that emits for changes in `@Input` properties. */
    _inputChanges: Subject<SimpleChanges>;
    /** Whether the expansion indicator should be hidden. */
    hideToggle: boolean;
    private _hideToggle;
    /**
     * The display mode used for all expansion panels in the accordion. Currently two display
     * modes exist:
     *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
     *     panel at a different elevation from the reset of the accordion.
     *  flat - no spacing is placed around expanded panels, showing all panels at the same
     *     elevation.
     */
    displayMode: MatAccordionDisplayMode;
    /** The positioning of the expansion indicator. */
    togglePosition: MatAccordionTogglePosition;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
