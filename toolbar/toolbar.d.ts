/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { CanColor } from '@angular/material/core';
/** @docs-private */
declare const _MatToolbarBase: import("@angular/material/core/common-behaviors/constructor").Constructor<CanColor> & import("@angular/material/core/common-behaviors/constructor").AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
export declare class MatToolbarRow {
}
export declare class MatToolbar extends _MatToolbarBase implements CanColor, AfterViewInit {
    private _platform;
    private _document;
    /** Reference to all toolbar row elements that have been projected. */
    _toolbarRows: QueryList<MatToolbarRow>;
    constructor(elementRef: ElementRef, _platform: Platform, document?: any);
    ngAfterViewInit(): void;
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    private _checkToolbarMixedModes;
}
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export declare function throwToolbarMixedModesError(): void;
export {};
