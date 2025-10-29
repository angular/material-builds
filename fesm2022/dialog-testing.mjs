import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import { __decorate, __metadata } from 'tslib';
import { inject, NgZone, Component, ChangeDetectionStrategy, ViewEncapsulation, NgModule } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from './dialog.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/scrolling';
import '@angular/cdk/overlay';
import '@angular/cdk/dialog';
import '@angular/cdk/coercion';
import '@angular/cdk/portal';
import './_animation-chunk.mjs';
import '@angular/cdk/layout';
import 'rxjs';
import 'rxjs/operators';
import '@angular/cdk/keycodes';
import '@angular/cdk/bidi';

var MatDialogSection;
(function (MatDialogSection) {
  MatDialogSection["TITLE"] = ".mat-mdc-dialog-title";
  MatDialogSection["CONTENT"] = ".mat-mdc-dialog-content";
  MatDialogSection["ACTIONS"] = ".mat-mdc-dialog-actions";
})(MatDialogSection || (MatDialogSection = {}));
class MatDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-dialog-container';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  _title = this.locatorForOptional(MatDialogSection.TITLE);
  _content = this.locatorForOptional(MatDialogSection.CONTENT);
  _actions = this.locatorForOptional(MatDialogSection.ACTIONS);
  async getId() {
    const id = await (await this.host()).getAttribute('id');
    return id !== '' ? id : null;
  }
  async getRole() {
    return (await this.host()).getAttribute('role');
  }
  async getAriaLabel() {
    return (await this.host()).getAttribute('aria-label');
  }
  async getAriaLabelledby() {
    return (await this.host()).getAttribute('aria-labelledby');
  }
  async getAriaDescribedby() {
    return (await this.host()).getAttribute('aria-describedby');
  }
  async close() {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }
  async getText() {
    return (await this.host()).text();
  }
  async getTitleText() {
    return (await this._title())?.text() ?? '';
  }
  async getContentText() {
    return (await this._content())?.text() ?? '';
  }
  async getActionsText() {
    return (await this._actions())?.text() ?? '';
  }
}

var MatTestDialogOpener_1;
let MatTestDialogOpener = class MatTestDialogOpener {
  static {
    MatTestDialogOpener_1 = this;
  }
  dialog = inject(MatDialog);
  static component;
  static config;
  dialogRef;
  closedResult;
  _afterClosedSubscription;
  _ngZone = inject(NgZone);
  static withComponent(component, config) {
    MatTestDialogOpener_1.component = component;
    MatTestDialogOpener_1.config = config;
    return MatTestDialogOpener_1;
  }
  constructor() {
    if (!MatTestDialogOpener_1.component) {
      throw new Error(`MatTestDialogOpener does not have a component provided.`);
    }
    this.dialogRef = this._ngZone.run(() => {
      const config = {
        ...(MatTestDialogOpener_1.config || {})
      };
      config.enterAnimationDuration = 0;
      config.exitAnimationDuration = 0;
      return this.dialog.open(MatTestDialogOpener_1.component, config);
    });
    this._afterClosedSubscription = this.dialogRef.afterClosed().subscribe(result => {
      this.closedResult = result;
    });
  }
  ngOnDestroy() {
    this._afterClosedSubscription.unsubscribe();
    MatTestDialogOpener_1.component = undefined;
    MatTestDialogOpener_1.config = undefined;
  }
};
MatTestDialogOpener = MatTestDialogOpener_1 = __decorate([Component({
  selector: 'mat-test-dialog-opener',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
}), __metadata("design:paramtypes", [])], MatTestDialogOpener);
let MatTestDialogOpenerModule = class MatTestDialogOpenerModule {};
MatTestDialogOpenerModule = __decorate([NgModule({
  imports: [MatDialogModule, MatTestDialogOpener],
  providers: [{
    provide: MATERIAL_ANIMATIONS,
    useValue: {
      animationsDisabled: true
    }
  }]
})], MatTestDialogOpenerModule);

export { MatDialogHarness, MatDialogSection, MatTestDialogOpener, MatTestDialogOpenerModule };
//# sourceMappingURL=dialog-testing.mjs.map
