import { BaseHarnessFilters } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatLegacyOptgroupHarness } from '@angular/material/legacy-core/testing';
import { MatLegacyOptionHarness } from '@angular/material/legacy-core/testing';
import { _MatSelectHarnessBase } from '@angular/material/select/testing';
import { OptgroupHarnessFilters } from '@angular/material/legacy-core/testing';
import { OptionHarnessFilters } from '@angular/material/legacy-core/testing';

/**
 * A set of criteria that can be used to filter a list of `MatSelectHarness` instances.
 * @deprecated Use `SelectHarnessFilters` from `@angular/material/select/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare interface LegacySelectHarnessFilters extends BaseHarnessFilters {
}

/**
 * Harness for interacting with a standard mat-select in tests.
 * @deprecated Use `MatSelectHarness` from `@angular/material/select/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacySelectHarness extends _MatSelectHarnessBase<typeof MatLegacyOptionHarness, MatLegacyOptionHarness, OptionHarnessFilters, typeof MatLegacyOptgroupHarness, MatLegacyOptgroupHarness, OptgroupHarnessFilters> {
    static hostSelector: string;
    protected _prefix: string;
    protected _optionClass: typeof MatLegacyOptionHarness;
    protected _optionGroupClass: typeof MatLegacyOptgroupHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: LegacySelectHarnessFilters): HarnessPredicate<MatLegacySelectHarness>;
}

export { }