/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, IterableDiffers } from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export declare class MatTable<T> extends CdkTable<T> {
    protected _differs: IterableDiffers;
    protected _changeDetectorRef: ChangeDetectorRef;
    protected _elementRef: ElementRef;
    constructor(_differs: IterableDiffers, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef, role: string);
}
