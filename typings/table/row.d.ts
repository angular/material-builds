/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { IterableDiffers, TemplateRef } from '@angular/core';
import { CdkFooterRow, CdkFooterRowDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef } from '@angular/cdk/table';
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class MatHeaderRowDef extends CdkHeaderRowDef {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
export declare class MatFooterRowDef extends CdkFooterRowDef {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/**
 * Data row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export declare class MatRowDef<T> extends CdkRowDef<T> {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/** Footer template container that contains the cell outlet. Adds the right class and role. */
export declare class MatHeaderRow extends CdkHeaderRow {
}
/** Footer template container that contains the cell outlet. Adds the right class and role. */
export declare class MatFooterRow extends CdkFooterRow {
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class MatRow extends CdkRow {
}
