import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MatTooltipHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-tooltip-trigger';
  _optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-mdc-tooltip');
  _hiddenClass = 'mat-mdc-tooltip-hide';
  _disabledClass = 'mat-mdc-tooltip-disabled';
  _showAnimationName = 'mat-mdc-tooltip-show';
  _hideAnimationName = 'mat-mdc-tooltip-hide';
  static with(options = {}) {
    return new HarnessPredicate(this, options);
  }
  async show() {
    const host = await this.host();
    await host.dispatchEvent('touchstart', {
      changedTouches: []
    });
    await host.hover();
    const panel = await this._optionalPanel();
    await panel?.dispatchEvent('animationend', {
      animationName: this._showAnimationName
    });
  }
  async hide() {
    const host = await this.host();
    await host.dispatchEvent('touchend');
    await host.mouseAway();
    const panel = await this._optionalPanel();
    await panel?.dispatchEvent('animationend', {
      animationName: this._hideAnimationName
    });
  }
  async isOpen() {
    const panel = await this._optionalPanel();
    return !!panel && !(await panel.hasClass(this._hiddenClass));
  }
  async isDisabled() {
    const host = await this.host();
    return host.hasClass(this._disabledClass);
  }
  async getTooltipText() {
    const panel = await this._optionalPanel();
    return panel ? panel.text() : '';
  }
}

export { MatTooltipHarness };
//# sourceMappingURL=tooltip-testing.mjs.map
