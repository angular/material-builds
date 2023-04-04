import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-divider`. */
class MatDividerHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatDividerHarness, options);
    }
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-orientation');
        });
    }
    isInset() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-divider-inset');
        });
    }
}
MatDividerHarness.hostSelector = '.mat-divider';

export { MatDividerHarness };
//# sourceMappingURL=testing.mjs.map
