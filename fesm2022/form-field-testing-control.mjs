import { ComponentHarness } from '@angular/cdk/testing';

class MatFormFieldControlHarness extends ComponentHarness {}
class MatFormFieldControlHarnessBase extends MatFormFieldControlHarness {
  async getLabel() {
    const documentRootLocator = this.documentRootLocatorFactory();
    const labelId = await (await this.host()).getAttribute('aria-labelledby');
    const labelText = await (await this.host()).getAttribute('aria-label');
    const hostId = await (await this.host()).getAttribute('id');
    if (labelId) {
      const labelEl = await documentRootLocator.locatorForOptional(`[id="${labelId}"]`)();
      return labelEl ? labelEl.text() : null;
    } else if (labelText) {
      return labelText;
    } else if (hostId) {
      const labelEl = await documentRootLocator.locatorForOptional(`[for="${hostId}"]`)();
      return labelEl ? labelEl.text() : null;
    }
    return null;
  }
}

export { MatFormFieldControlHarness, MatFormFieldControlHarnessBase };
//# sourceMappingURL=form-field-testing-control.mjs.map
