import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/core';
import { QueryList } from '@angular/core';

declare namespace i2 {
    export {
        throwToolbarMixedModesError,
        MatToolbarRow,
        MatToolbar
    }
}

export declare class MatToolbar implements AfterViewInit {
    protected _elementRef: ElementRef<any>;
    private _platform;
    private _document;
    /**
     * Theme color of the toolbar. This API is supported in M2 themes only, it has
     * no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/toolbar/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: string | null;
    /** Reference to all toolbar row elements that have been projected. */
    _toolbarRows: QueryList<MatToolbarRow>;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    private _checkToolbarMixedModes;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatToolbar, "mat-toolbar", ["matToolbar"], { "color": { "alias": "color"; "required": false; }; }, {}, ["_toolbarRows"], ["*", "mat-toolbar-row"], true, never>;
}

export declare class MatToolbarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatToolbarModule, never, [typeof i1.MatCommonModule, typeof i2.MatToolbar, typeof i2.MatToolbarRow], [typeof i2.MatToolbar, typeof i2.MatToolbarRow, typeof i1.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatToolbarModule>;
}

export declare class MatToolbarRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbarRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatToolbarRow, "mat-toolbar-row", ["matToolbarRow"], {}, {}, never, never, true, never>;
}

/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export declare function throwToolbarMixedModesError(): void;

export { }
