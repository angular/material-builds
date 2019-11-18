import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-drawer in tests. */
class MatDrawerHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a drawer with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options)
            .addOption('position', options.position, (harness, position) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getPosition()) === position; }));
    }
    /** Gets whether the drawer is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-drawer-opened');
        });
    }
    /** Gets the position of the drawer inside its container. */
    getPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.hasClass('mat-drawer-end')) ? 'end' : 'start';
        });
    }
    /** Gets the mode that the drawer is in. */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            if (yield host.hasClass('mat-drawer-push')) {
                return 'push';
            }
            if (yield host.hasClass('mat-drawer-side')) {
                return 'side';
            }
            return 'over';
        });
    }
}
MatDrawerHarness.hostSelector = '.mat-drawer';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-sidenav in tests. */
class MatSidenavHarness extends MatDrawerHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a sidenav with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options)
            .addOption('position', options.position, (harness, position) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getPosition()) === position; }));
    }
    /** Gets whether the sidenav is fixed in the viewport. */
    isFixedInViewport() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-sidenav-fixed');
        });
    }
}
MatSidenavHarness.hostSelector = '.mat-sidenav';

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

export { MatDrawerHarness, MatSidenavHarness };
//# sourceMappingURL=testing.js.map
