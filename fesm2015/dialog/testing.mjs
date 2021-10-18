import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, TestKey, HarnessPredicate } from '@angular/cdk/testing';

/** Base class for the `MatDialogHarness` implementation. */
class _MatDialogHarnessBase
// @breaking-change 14.0.0 change generic type to MatDialogSection.
 extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-dialog-title" /* TITLE */);
        this._content = this.locatorForOptional(".mat-dialog-content" /* CONTENT */);
        this._actions = this.locatorForOptional(".mat-dialog-actions" /* ACTIONS */);
    }
    /** Gets the id of the dialog. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield (yield this.host()).getAttribute('id');
            // In case no id has been specified, the "id" property always returns
            // an empty string. To make this method more explicit, we return null.
            return id !== '' ? id : null;
        });
    }
    /** Gets the role of the dialog. */
    getRole() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('role');
        });
    }
    /** Gets the value of the dialog's "aria-label" attribute. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-labelledby');
        });
    }
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    getAriaDescribedby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-describedby');
        });
    }
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).sendKeys(TestKey.ESCAPE);
        });
    }
    /** Gets te dialog's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    getTitleText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._title())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    getContentText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._content())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    getActionsText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._actions())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
}
/** Harness for interacting with a standard `MatDialog` in tests. */
class MatDialogHarness extends _MatDialogHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDialogHarness` that meets
     * certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDialogHarness, options);
    }
}
// Developers can provide a custom component or template for the
// dialog. The canonical dialog parent is the "MatDialogContainer".
/** The selector for the host element of a `MatDialog` instance. */
MatDialogHarness.hostSelector = '.mat-dialog-container';

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

export { MatDialogHarness, _MatDialogHarnessBase };
//# sourceMappingURL=testing.mjs.map
