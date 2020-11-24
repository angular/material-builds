/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTextColumn } from '@angular/cdk/table';
export declare const _MAT_TEXT_COLUMN_TEMPLATE = "\n  <ng-container matColumnDef>\n    <th mat-header-cell *matHeaderCellDef [style.text-align]=\"justify\">\n      {{headerText}}\n    </th>\n    <td mat-cell *matCellDef=\"let data\" [style.text-align]=\"justify\">\n      {{dataAccessor(data, name)}}\n    </td>\n  </ng-container>\n";
/**
 * Column that simply shows text content for the header and row cells. Assumes that the table
 * is using the native table implementation (`<table>`).
 *
 * By default, the name of this column will be the header text and data property accessor.
 * The header text can be overridden with the `headerText` input. Cell values can be overridden with
 * the `dataAccessor` input. Change the text justification to the start or end using the `justify`
 * input.
 */
export declare class MatTextColumn<T> extends CdkTextColumn<T> {
}
