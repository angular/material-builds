import { HarnessPredicate } from '@angular/cdk/testing';
import { MatLegacyOptionHarness, MatLegacyOptgroupHarness } from '@angular/material/legacy-core/testing';
import { _MatAutocompleteHarnessBase } from '@angular/material/autocomplete/testing';

/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @deprecated Use `MatAutocompleteHarness` from `@angular/material/autocomplete/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyAutocompleteHarness extends _MatAutocompleteHarnessBase {
    constructor() {
        super(...arguments);
        this._prefix = 'mat';
        this._optionClass = MatLegacyOptionHarness;
        this._optionGroupClass = MatLegacyOptgroupHarness;
    }
    /** The selector for the host element of a `MatAutocomplete` instance. */
    static { this.hostSelector = '.mat-autocomplete-trigger'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyAutocompleteHarness, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value))
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
}

export { MatLegacyAutocompleteHarness };
//# sourceMappingURL=testing.mjs.map
