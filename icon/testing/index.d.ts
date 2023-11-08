import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import * as i0 from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';

/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
export declare class FakeMatIconRegistry implements PublicApi<MatIconRegistry>, OnDestroy {
    addSvgIcon(): this;
    addSvgIconLiteral(): this;
    addSvgIconInNamespace(): this;
    addSvgIconLiteralInNamespace(): this;
    addSvgIconSet(): this;
    addSvgIconSetLiteral(): this;
    addSvgIconSetInNamespace(): this;
    addSvgIconSetLiteralInNamespace(): this;
    registerFontClassAlias(): this;
    classNameForFontAlias(alias: string): string;
    getDefaultFontSetClass(): string[];
    getSvgIconFromUrl(): Observable<SVGElement>;
    getNamedSvgIcon(): Observable<SVGElement>;
    setDefaultFontSetClass(): this;
    addSvgIconResolver(): this;
    ngOnDestroy(): void;
    private _generateEmptySvg;
    static ɵfac: i0.ɵɵFactoryDeclaration<FakeMatIconRegistry, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FakeMatIconRegistry>;
}

/** A set of criteria that can be used to filter a list of `MatIconHarness` instances. */
export declare interface IconHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the typef of the icon. */
    type?: IconType;
    /** Filters based on the name of the icon. */
    name?: string | RegExp;
    /** Filters based on the namespace of the icon. */
    namespace?: string | null | RegExp;
}

/** Possible types of icons. */
export declare const enum IconType {
    SVG = 0,
    FONT = 1
}

/** Harness for interacting with a standard mat-icon in tests. */
export declare class MatIconHarness extends ComponentHarness {
    /** The selector for the host element of a `MatIcon` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatIconHarness` that meets
     * certain criteria.
     * @param options Options for filtering which icon instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: IconHarnessFilters): HarnessPredicate<MatIconHarness>;
    /** Gets the type of the icon. */
    getType(): Promise<IconType>;
    /** Gets the name of the icon. */
    getName(): Promise<string | null>;
    /** Gets the namespace of the icon. */
    getNamespace(): Promise<string | null>;
    /** Gets whether the icon is inline. */
    isInline(): Promise<boolean>;
}

/** Import this module in tests to install the null icon registry. */
export declare class MatIconTestingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIconTestingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatIconTestingModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatIconTestingModule>;
}

declare type PublicApi<T> = {
    [K in keyof T]: T[K] extends (...x: any[]) => T ? (...x: any[]) => PublicApi<T> : T[K];
};

export { }
