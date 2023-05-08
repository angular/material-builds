import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatTooltipHarnessBase } from '@angular/material/tooltip/testing';

/**
 * Harness for interacting with a standard mat-tooltip in tests.
 * @deprecated Use `MatTooltipHarness` from `@angular/material/tooltip/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTooltipHarness extends _MatTooltipHarnessBase {
    constructor() {
        super(...arguments);
        this._optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-tooltip');
        this._hiddenClass = 'mat-tooltip-hide';
        this._disabledClass = 'mat-tooltip-disabled';
        this._showAnimationName = 'mat-tooltip-show';
        this._hideAnimationName = 'mat-tooltip-hide';
    }
    static { this.hostSelector = '.mat-tooltip-trigger'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyTooltipHarness, options);
    }
}

export { MatLegacyTooltipHarness };
//# sourceMappingURL=testing.mjs.map
