import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatCellHarnessBase, _MatRowHarnessBase, _MatTableHarnessBase } from '@angular/material/table/testing';
export { _MatCellHarnessBase as _MatLegacyCellHarnessBase, _MatRowHarnessBase as _MatLegacyRowHarnessBase, _MatTableHarnessBase as _MatLegacyTableHarnessBase } from '@angular/material/table/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material table cell. */
class MatLegacyCellHarness extends _MatCellHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(MatLegacyCellHarness, options);
    }
}
/** The selector for the host element of a `MatCellHarness` instance. */
MatLegacyCellHarness.hostSelector = '.mat-cell';
/** Harness for interacting with a standard Angular Material table header cell. */
class MatLegacyHeaderCellHarness extends _MatCellHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(MatLegacyHeaderCellHarness, options);
    }
}
/** The selector for the host element of a `MatHeaderCellHarness` instance. */
MatLegacyHeaderCellHarness.hostSelector = '.mat-header-cell';
/** Harness for interacting with a standard Angular Material table footer cell. */
class MatLegacyFooterCellHarness extends _MatCellHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(MatLegacyFooterCellHarness, options);
    }
}
/** The selector for the host element of a `MatFooterCellHarness` instance. */
MatLegacyFooterCellHarness.hostSelector = '.mat-footer-cell';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material table row. */
class MatLegacyRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyCellHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyRowHarness, options);
    }
}
/** The selector for the host element of a `MatRowHarness` instance. */
MatLegacyRowHarness.hostSelector = '.mat-row';
/** Harness for interacting with a standard Angular Material table header row. */
class MatLegacyHeaderRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyHeaderCellHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyHeaderRowHarness, options);
    }
}
/** The selector for the host element of a `MatHeaderRowHarness` instance. */
MatLegacyHeaderRowHarness.hostSelector = '.mat-header-row';
/** Harness for interacting with a standard Angular Material table footer row. */
class MatLegacyFooterRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyFooterCellHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer row cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyFooterRowHarness, options);
    }
}
/** The selector for the host element of a `MatFooterRowHarness` instance. */
MatLegacyFooterRowHarness.hostSelector = '.mat-footer-row';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-table in tests. */
class MatLegacyTableHarness extends _MatTableHarnessBase {
    constructor() {
        super(...arguments);
        this._headerRowHarness = MatLegacyHeaderRowHarness;
        this._rowHarness = MatLegacyRowHarness;
        this._footerRowHarness = MatLegacyFooterRowHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyTableHarness, options);
    }
}
/** The selector for the host element of a `MatTableHarness` instance. */
MatLegacyTableHarness.hostSelector = '.mat-table';

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

export { MatLegacyCellHarness, MatLegacyFooterCellHarness, MatLegacyFooterRowHarness, MatLegacyHeaderCellHarness, MatLegacyHeaderRowHarness, MatLegacyRowHarness, MatLegacyTableHarness };
//# sourceMappingURL=testing.mjs.map
