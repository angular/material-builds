import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';

class MatSnackBarHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-mdc-snack-bar-container:not([mat-exit])';
  _messageSelector = '.mdc-snackbar__label';
  _actionButtonSelector = '.mat-mdc-snack-bar-action';
  _snackBarLiveRegion = this.locatorFor('[aria-live]');
  static with(options = {}) {
    return new HarnessPredicate(MatSnackBarHarness, options);
  }
  async getRole() {
    return (await this.host()).getAttribute('role');
  }
  async getAriaLive() {
    return (await this._snackBarLiveRegion()).getAttribute('aria-live');
  }
  async hasAction() {
    return (await this._getActionButton()) !== null;
  }
  async getActionDescription() {
    await this._assertHasAction();
    return (await this._getActionButton()).text();
  }
  async dismissWithAction() {
    await this._assertHasAction();
    await (await this._getActionButton()).click();
  }
  async getMessage() {
    return (await this.locatorFor(this._messageSelector)()).text();
  }
  async isDismissed() {
    const host = await this.host();
    const [exit, dimensions] = await parallel(() => [host.getAttribute('mat-exit'), host.getDimensions()]);
    return exit != null || !!dimensions && dimensions.height === 0 && dimensions.width === 0;
  }
  async _assertHasAction() {
    if (!(await this.hasAction())) {
      throw Error('Method cannot be used for a snack-bar without an action.');
    }
  }
  async _getActionButton() {
    return this.locatorForOptional(this._actionButtonSelector)();
  }
}

export { MatSnackBarHarness };
//# sourceMappingURL=snack-bar-testing.mjs.map
