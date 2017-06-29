/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2 } from '@angular/core';
import { CdkCell, CdkColumnDef, CdkHeaderCell } from '../core/data-table/cell';
/** Header cell template container that adds the right classes and role. */
export declare class MdHeaderCell extends CdkHeaderCell {
    constructor(columnDef: CdkColumnDef, elementRef: ElementRef, renderer: Renderer2);
}
/** Cell template container that adds the right classes and role. */
export declare class MdCell extends CdkCell {
    constructor(columnDef: CdkColumnDef, elementRef: ElementRef, renderer: Renderer2);
}
