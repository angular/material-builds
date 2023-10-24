import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * Harness for interacting with a standard mat-progress-bar in tests.
 * @deprecated Use `MatProgressBarHarness` from `@angular/material/progress-bar/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyProgressBarHarness extends ComponentHarness {
    /** The selector for the host element of a `MatProgressBar` instance. */
    static { this.hostSelector = '.mat-progress-bar'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatProgressBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which progress bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyProgressBarHarness, options);
    }
    /** Gets the progress bar's value. */
    async getValue() {
        const host = await this.host();
        const ariaValue = await host.getAttribute('aria-valuenow');
        return ariaValue ? coerceNumberProperty(ariaValue) : null;
    }
    /** Gets the progress bar's mode. */
    async getMode() {
        return (await this.host()).getAttribute('mode');
    }
}

export { MatLegacyProgressBarHarness };
//# sourceMappingURL=testing.mjs.map
