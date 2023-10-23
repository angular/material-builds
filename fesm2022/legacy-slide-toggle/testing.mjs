import { HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { _MatSlideToggleHarnessBase } from '@angular/material/slide-toggle/testing';
export { _MatSlideToggleHarnessBase as _MatLegacySlideToggleHarnessBase } from '@angular/material/slide-toggle/testing';

/**
 * Harness for interacting with a standard mat-slide-toggle in tests.
 * @deprecated Use `MatSlideToggleHarness` from `@angular/material/slide-toggle/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySlideToggleHarness extends _MatSlideToggleHarnessBase {
    constructor() {
        super(...arguments);
        this._inputContainer = this.locatorFor('.mat-slide-toggle-bar');
        this._nativeElement = this.locatorFor('input');
    }
    /** The selector for the host element of a `MatSlideToggle` instance. */
    static { this.hostSelector = '.mat-slide-toggle'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSlideToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which slide toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return (new HarnessPredicate(MatLegacySlideToggleHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the slide-toggle is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) == disabled));
    }
    /** Toggle the checked state of the slide-toggle. */
    async toggle() {
        return (await this._inputContainer()).click();
    }
    /** Whether the slide-toggle is checked. */
    async isChecked() {
        const checked = (await this._nativeElement()).getProperty('checked');
        return coerceBooleanProperty(await checked);
    }
}

export { MatLegacySlideToggleHarness };
//# sourceMappingURL=testing.mjs.map
