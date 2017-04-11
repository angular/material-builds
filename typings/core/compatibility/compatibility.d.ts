import { ModuleWithProviders, OpaqueToken, ElementRef } from '@angular/core';
import { MdError } from '../errors/error';
export declare const MATERIAL_COMPATIBILITY_MODE: OpaqueToken;
/**
 * Exception thrown if the consumer has used an invalid Material prefix on a component.
 * @docs-private
 */
export declare class MdCompatibilityInvalidPrefixError extends MdError {
    constructor(prefix: string, nodeName: string);
}
/** Selector that matches all elements that may have style collisions with AngularJS Material. */
export declare const MAT_ELEMENTS_SELECTOR: string;
/** Selector that matches all elements that may have style collisions with AngularJS Material. */
export declare const MD_ELEMENTS_SELECTOR: string;
/** Directive that enforces that the `mat-` prefix cannot be used. */
export declare class MatPrefixRejector {
    constructor(isCompatibilityMode: boolean, elementRef: ElementRef);
}
/** Directive that enforces that the `md-` prefix cannot be used. */
export declare class MdPrefixRejector {
    constructor(isCompatibilityMode: boolean, elementRef: ElementRef);
}
/**
 * Module that enforces the default compatibility mode settings. When this module is loaded
 * without NoConflictStyleCompatibilityMode also being imported, it will throw an error if
 * there are any uses of the `mat-` prefix.
 */
export declare class CompatibilityModule {
    private _document;
    static forRoot(): ModuleWithProviders;
    constructor(_document: any);
    private _checkDoctype();
    private _checkTheme();
}
/**
 * Module that enforces "no-conflict" compatibility mode settings. When this module is loaded,
 * it will throw an error if there are any uses of the `md-` prefix.
 */
export declare class NoConflictStyleCompatibilityMode {
}
