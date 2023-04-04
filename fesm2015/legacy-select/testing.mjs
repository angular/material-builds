import { __awaiter } from 'tslib';
import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatSelectHarnessBase } from '@angular/material/select/testing';
import { MatLegacyOptionHarness, MatLegacyOptgroupHarness } from '@angular/material/legacy-core/testing';

/**
 * Harness for interacting with a standard mat-select in tests.
 * @deprecated Use `MatSelectHarness` from `@angular/material/select/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySelectHarness extends _MatSelectHarnessBase {
    constructor() {
        super(...arguments);
        this._prefix = 'mat';
        this._optionClass = MatLegacyOptionHarness;
        this._optionGroupClass = MatLegacyOptgroupHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacySelectHarness, options).addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isDisabled()) === disabled;
        }));
    }
}
MatLegacySelectHarness.hostSelector = '.mat-select';

export { MatLegacySelectHarness };
//# sourceMappingURL=testing.mjs.map
