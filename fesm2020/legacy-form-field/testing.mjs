export { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatDatepickerInputHarness, MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { _MatFormFieldHarnessBase } from '@angular/material/form-field/testing';
import { MatLegacyInputHarness } from '@angular/material/legacy-input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material form-field's in tests. */
class MatLegacyFormFieldHarness extends _MatFormFieldHarnessBase {
    constructor() {
        super(...arguments);
        this._prefixContainer = this.locatorForOptional('.mat-form-field-prefix');
        this._suffixContainer = this.locatorForOptional('.mat-form-field-suffix');
        this._label = this.locatorForOptional('.mat-form-field-label');
        this._errors = this.locatorForAll('.mat-error');
        this._hints = this.locatorForAll('mat-hint, .mat-hint');
        this._inputControl = this.locatorForOptional(MatLegacyInputHarness);
        this._selectControl = this.locatorForOptional(MatSelectHarness);
        this._datepickerInputControl = this.locatorForOptional(MatDatepickerInputHarness);
        this._dateRangeInputControl = this.locatorForOptional(MatDateRangeInputHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyFormFieldHarness, options)
            .addOption('floatingLabelText', options.floatingLabelText, async (harness, text) => HarnessPredicate.stringMatches(await harness.getLabel(), text))
            .addOption('hasErrors', options.hasErrors, async (harness, hasErrors) => (await harness.hasErrors()) === hasErrors);
    }
    /** Gets the appearance of the form-field. */
    async getAppearance() {
        const hostClasses = await (await this.host()).getAttribute('class');
        if (hostClasses !== null) {
            const appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
            if (appearanceMatch) {
                return appearanceMatch[1];
            }
        }
        throw Error('Could not determine appearance of form-field.');
    }
    /** Whether the form-field has a label. */
    async hasLabel() {
        return (await this.host()).hasClass('mat-form-field-has-label');
    }
    /** Whether the label is currently floating. */
    async isLabelFloating() {
        const host = await this.host();
        const [hasLabel, shouldFloat] = await parallel(() => [
            this.hasLabel(),
            host.hasClass('mat-form-field-should-float'),
        ]);
        // If there is no label, the label conceptually can never float. The `should-float` class
        // is just always set regardless of whether the label is displayed or not.
        return hasLabel && shouldFloat;
    }
}
MatLegacyFormFieldHarness.hostSelector = '.mat-form-field';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatLegacyFormFieldHarness };
//# sourceMappingURL=testing.mjs.map
