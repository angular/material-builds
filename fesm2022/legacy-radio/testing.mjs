import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatRadioGroupHarnessBase, _MatRadioButtonHarnessBase } from '@angular/material/radio/testing';

/**
 * Harness for interacting with a standard mat-radio-group in tests
 * @deprecated Use `MatRadioGroupHarness` from `@angular/material/radio/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyRadioGroupHarness extends _MatRadioGroupHarnessBase {
    constructor() {
        super(...arguments);
        this._buttonClass = MatLegacyRadioButtonHarness;
    }
    /** The selector for the host element of a `MatRadioGroup` instance. */
    static { this.hostSelector = '.mat-radio-group'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyRadioGroupHarness, options).addOption('name', options.name, this._checkRadioGroupName);
    }
}
/**
 * Harness for interacting with a standard mat-radio-button in tests.
 * @deprecated Use `MatRadioButtonHarness` from `@angular/material/radio/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyRadioButtonHarness extends _MatRadioButtonHarnessBase {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-radio-label-content');
        this._clickLabel = this.locatorFor('.mat-radio-label');
    }
    /** The selector for the host element of a `MatRadioButton` instance. */
    static { this.hostSelector = '.mat-radio-button'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioButtonHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio button instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyRadioButtonHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked);
    }
}

export { MatLegacyRadioButtonHarness, MatLegacyRadioGroupHarness };
//# sourceMappingURL=testing.mjs.map
