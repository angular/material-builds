import { __awaiter } from 'tslib';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a MDC based mat-progress-spinner in tests. */
class MatProgressSpinnerHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress spinnner with specific
     * attributes.
     * @param options Options for filtering which progress spinner instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Gets the progress spinner's value. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const ariaValue = yield host.getAttribute('aria-valuenow');
            return ariaValue ? coerceNumberProperty(ariaValue) : null;
        });
    }
    /** Gets the progress spinner's mode. */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const modeAttr = (yield this.host()).getAttribute('mode');
            return (yield modeAttr);
        });
    }
}
/** The selector for the host element of a `MatProgressSpinner` instance. */
MatProgressSpinnerHarness.hostSelector = '.mat-mdc-progress-spinner';

/**
 * Generated bundle index. Do not edit.
 */

export { MatProgressSpinnerHarness };
//# sourceMappingURL=testing.mjs.map
