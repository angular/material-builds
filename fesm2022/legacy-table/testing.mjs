import { HarnessPredicate } from '@angular/cdk/testing';
import { _MatCellHarnessBase, _MatRowHarnessBase, _MatTableHarnessBase } from '@angular/material/table/testing';
export { _MatCellHarnessBase as _MatLegacyCellHarnessBase, _MatRowHarnessBase as _MatLegacyRowHarnessBase, _MatTableHarnessBase as _MatLegacyTableHarnessBase } from '@angular/material/table/testing';

/**
 * Harness for interacting with a standard Angular Material table cell.
 * @deprecated Use `MatCellHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatCellHarness` instance. */
    static { this.hostSelector = '.mat-cell'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}
/**
 * Harness for interacting with a standard Angular Material table header cell.
 * @deprecated Use `MatHeaderCellHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyHeaderCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatHeaderCellHarness` instance. */
    static { this.hostSelector = '.mat-header-cell'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table header cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}
/**
 * Harness for interacting with a standard Angular Material table footer cell.
 * @deprecated Use `MatFooterCellHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyFooterCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatFooterCellHarness` instance. */
    static { this.hostSelector = '.mat-footer-cell'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for
     * a table footer cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}

/**
 * Harness for interacting with a standard Angular Material table row.
 * @deprecated Use `MatRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyCellHarness;
    }
    /** The selector for the host element of a `MatRowHarness` instance. */
    static { this.hostSelector = '.mat-row'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyRowHarness, options);
    }
}
/**
 * Harness for interacting with a standard Angular Material table header row.
 * @deprecated Use `MatHeaderRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyHeaderRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyHeaderCellHarness;
    }
    /** The selector for the host element of a `MatHeaderRowHarness` instance. */
    static { this.hostSelector = '.mat-header-row'; }
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
/**
 * Harness for interacting with a standard Angular Material table footer row.
 * @deprecated Use `MatFooterRowHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyFooterRowHarness extends _MatRowHarnessBase {
    constructor() {
        super(...arguments);
        this._cellHarness = MatLegacyFooterCellHarness;
    }
    /** The selector for the host element of a `MatFooterRowHarness` instance. */
    static { this.hostSelector = '.mat-footer-row'; }
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

/**
 * Harness for interacting with a standard mat-table in tests.
 * @deprecated Use `MatTableHarness` from `@angular/material/table/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTableHarness extends _MatTableHarnessBase {
    constructor() {
        super(...arguments);
        this._headerRowHarness = MatLegacyHeaderRowHarness;
        this._rowHarness = MatLegacyRowHarness;
        this._footerRowHarness = MatLegacyFooterRowHarness;
    }
    /** The selector for the host element of a `MatTableHarness` instance. */
    static { this.hostSelector = '.mat-table'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyTableHarness, options);
    }
}

export { MatLegacyCellHarness, MatLegacyFooterCellHarness, MatLegacyFooterRowHarness, MatLegacyHeaderCellHarness, MatLegacyHeaderRowHarness, MatLegacyRowHarness, MatLegacyTableHarness };
//# sourceMappingURL=testing.mjs.map
