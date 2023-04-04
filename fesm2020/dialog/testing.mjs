import { ContentContainerComponentHarness, TestKey, HarnessPredicate } from '@angular/cdk/testing';
import { __decorate, __metadata } from 'tslib';
import { Directive, Component, ChangeDetectionStrategy, ViewEncapsulation, NgModule } from '@angular/core';
import { _MatDialogBase, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/** Base class for the `MatDialogHarness` implementation. */
class _MatDialogHarnessBase
// @breaking-change 14.0.0 change generic type to MatDialogSection.
 extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-mdc-dialog-title" /* MatDialogSection.TITLE */);
        this._content = this.locatorForOptional(".mat-mdc-dialog-content" /* MatDialogSection.CONTENT */);
        this._actions = this.locatorForOptional(".mat-mdc-dialog-actions" /* MatDialogSection.ACTIONS */);
    }
    /** Gets the id of the dialog. */
    async getId() {
        const id = await (await this.host()).getAttribute('id');
        // In case no id has been specified, the "id" property always returns
        // an empty string. To make this method more explicit, we return null.
        return id !== '' ? id : null;
    }
    /** Gets the role of the dialog. */
    async getRole() {
        return (await this.host()).getAttribute('role');
    }
    /** Gets the value of the dialog's "aria-label" attribute. */
    async getAriaLabel() {
        return (await this.host()).getAttribute('aria-label');
    }
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    async getAriaLabelledby() {
        return (await this.host()).getAttribute('aria-labelledby');
    }
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    async getAriaDescribedby() {
        return (await this.host()).getAttribute('aria-describedby');
    }
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    async close() {
        await (await this.host()).sendKeys(TestKey.ESCAPE);
    }
    /** Gets te dialog's text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    async getTitleText() {
        return (await this._title())?.text() ?? '';
    }
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    async getContentText() {
        return (await this._content())?.text() ?? '';
    }
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    async getActionsText() {
        return (await this._actions())?.text() ?? '';
    }
}
/** Harness for interacting with a standard `MatDialog` in tests. */
class MatDialogHarness extends _MatDialogHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a dialog with specific attributes.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}
/** The selector for the host element of a `MatDialog` instance. */
MatDialogHarness.hostSelector = '.mat-mdc-dialog-container';

var _MatTestDialogOpenerBase_1, MatTestDialogOpener_1;
/** Base class for a component that immediately opens a dialog when created. */
let _MatTestDialogOpenerBase = _MatTestDialogOpenerBase_1 = class _MatTestDialogOpenerBase {
    constructor(dialog) {
        this.dialog = dialog;
        if (!_MatTestDialogOpenerBase_1.component) {
            throw new Error(`MatTestDialogOpener does not have a component provided.`);
        }
        this.dialogRef = this.dialog.open(_MatTestDialogOpenerBase_1.component, _MatTestDialogOpenerBase_1.config || {});
        this._afterClosedSubscription = this.dialogRef.afterClosed().subscribe(result => {
            this.closedResult = result;
        });
    }
    ngOnDestroy() {
        this._afterClosedSubscription.unsubscribe();
        _MatTestDialogOpenerBase_1.component = undefined;
        _MatTestDialogOpenerBase_1.config = undefined;
    }
};
_MatTestDialogOpenerBase = _MatTestDialogOpenerBase_1 = __decorate([
    Directive(),
    __metadata("design:paramtypes", [_MatDialogBase])
], _MatTestDialogOpenerBase);
/** Test component that immediately opens a dialog when bootstrapped. */
let MatTestDialogOpener = MatTestDialogOpener_1 = class MatTestDialogOpener extends _MatTestDialogOpenerBase {
    constructor(dialog) {
        super(dialog);
    }
    /** Static method that prepares this class to open the provided component. */
    static withComponent(component, config) {
        _MatTestDialogOpenerBase.component = component;
        _MatTestDialogOpenerBase.config = config;
        return MatTestDialogOpener_1;
    }
};
MatTestDialogOpener = MatTestDialogOpener_1 = __decorate([
    Component({
        selector: 'mat-test-dialog-opener',
        template: '',
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
    }),
    __metadata("design:paramtypes", [MatDialog])
], MatTestDialogOpener);
let MatTestDialogOpenerModule = class MatTestDialogOpenerModule {
};
MatTestDialogOpenerModule = __decorate([
    NgModule({
        declarations: [MatTestDialogOpener],
        imports: [MatDialogModule, NoopAnimationsModule],
    })
], MatTestDialogOpenerModule);

export { MatDialogHarness, MatTestDialogOpener, MatTestDialogOpenerModule, _MatDialogHarnessBase, _MatTestDialogOpenerBase };
//# sourceMappingURL=testing.mjs.map
