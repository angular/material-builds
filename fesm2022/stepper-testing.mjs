import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

class MatStepHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-step-header';
  static with(options = {}) {
    return new HarnessPredicate(MatStepHarness, options).addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label)).addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected).addOption('completed', options.completed, async (harness, completed) => (await harness.isCompleted()) === completed).addOption('invalid', options.invalid, async (harness, invalid) => (await harness.hasErrors()) === invalid);
  }
  async getLabel() {
    return (await this.locatorFor('.mat-step-text-label')()).text();
  }
  async getAriaLabel() {
    return (await this.host()).getAttribute('aria-label');
  }
  async getAriaLabelledby() {
    return (await this.host()).getAttribute('aria-labelledby');
  }
  async isSelected() {
    const host = await this.host();
    return (await host.getAttribute('aria-selected')) === 'true' || (await host.getAttribute('aria-current')) === 'step';
  }
  async isCompleted() {
    const state = await this._getIconState();
    return state === 'done' || state === 'edit' && !(await this.isSelected());
  }
  async hasErrors() {
    return (await this._getIconState()) === 'error';
  }
  async isOptional() {
    const optionalNode = await this.locatorForOptional('.mat-step-optional')();
    return !!optionalNode;
  }
  async select() {
    await (await this.host()).click();
  }
  async getRootHarnessLoader() {
    const contentId = await (await this.host()).getAttribute('aria-controls');
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
  }
  async _getIconState() {
    const icon = await this.locatorFor('.mat-step-icon')();
    const classes = await icon.getAttribute('class');
    const match = classes.match(/mat-step-icon-state-([a-z]+)/);
    if (!match) {
      throw Error(`Could not determine step state from "${classes}".`);
    }
    return match[1];
  }
}

var StepperOrientation;
(function (StepperOrientation) {
  StepperOrientation[StepperOrientation["HORIZONTAL"] = 0] = "HORIZONTAL";
  StepperOrientation[StepperOrientation["VERTICAL"] = 1] = "VERTICAL";
})(StepperOrientation || (StepperOrientation = {}));

class MatStepperHarness extends ComponentHarness {
  static hostSelector = '.mat-stepper-horizontal, .mat-stepper-vertical';
  static with(options = {}) {
    return new HarnessPredicate(MatStepperHarness, options).addOption('orientation', options.orientation, async (harness, orientation) => (await harness.getOrientation()) === orientation);
  }
  async getSteps(filter = {}) {
    return this.locatorForAll(MatStepHarness.with(filter))();
  }
  async getOrientation() {
    const host = await this.host();
    return (await host.hasClass('mat-stepper-horizontal')) ? StepperOrientation.HORIZONTAL : StepperOrientation.VERTICAL;
  }
  async selectStep(filter = {}) {
    const steps = await this.getSteps(filter);
    if (!steps.length) {
      throw Error(`Cannot find mat-step matching filter ${JSON.stringify(filter)}`);
    }
    await steps[0].select();
  }
}

class StepperButtonHarness extends ComponentHarness {
  async getText() {
    return (await this.host()).text();
  }
  async click() {
    return (await this.host()).click();
  }
}
class MatStepperNextHarness extends StepperButtonHarness {
  static hostSelector = '.mat-stepper-next';
  static with(options = {}) {
    return new HarnessPredicate(MatStepperNextHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
  }
}
class MatStepperPreviousHarness extends StepperButtonHarness {
  static hostSelector = '.mat-stepper-previous';
  static with(options = {}) {
    return new HarnessPredicate(MatStepperPreviousHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
  }
}

export { MatStepHarness, MatStepperHarness, MatStepperNextHarness, MatStepperPreviousHarness, StepperOrientation };
//# sourceMappingURL=stepper-testing.mjs.map
