import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';

var ThumbPosition;
(function (ThumbPosition) {
  ThumbPosition[ThumbPosition["START"] = 0] = "START";
  ThumbPosition[ThumbPosition["END"] = 1] = "END";
})(ThumbPosition || (ThumbPosition = {}));

class MatSliderThumbHarness extends ComponentHarness {
  static hostSelector = 'input[matSliderThumb], input[matSliderStartThumb], input[matSliderEndThumb]';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('position', options.position, async (harness, value) => {
      return (await harness.getPosition()) === value;
    });
  }
  async getPosition() {
    const isStart = (await (await this.host()).getAttribute('matSliderStartThumb')) != null;
    return isStart ? ThumbPosition.START : ThumbPosition.END;
  }
  async getValue() {
    return await (await this.host()).getProperty('valueAsNumber');
  }
  async setValue(newValue) {
    const input = await this.host();
    await input.setInputValue(newValue + '');
    await input.dispatchEvent('input');
    await input.dispatchEvent('change');
  }
  async getPercentage() {
    const [value, min, max] = await parallel(() => [this.getValue(), this.getMinValue(), this.getMaxValue()]);
    return (value - min) / (max - min);
  }
  async getMaxValue() {
    return coerceNumberProperty(await (await this.host()).getProperty('max'));
  }
  async getMinValue() {
    return coerceNumberProperty(await (await this.host()).getProperty('min'));
  }
  async getDisplayValue() {
    return (await (await this.host()).getAttribute('aria-valuetext')) || '';
  }
  async isDisabled() {
    return (await this.host()).getProperty('disabled');
  }
  async getName() {
    return await (await this.host()).getProperty('name');
  }
  async getId() {
    return await (await this.host()).getProperty('id');
  }
  async focus() {
    return (await this.host()).focus();
  }
  async blur() {
    return (await this.host()).blur();
  }
  async isFocused() {
    return (await this.host()).isFocused();
  }
}

class MatSliderHarness extends ComponentHarness {
  static hostSelector = '.mat-mdc-slider';
  static with(options = {}) {
    return new HarnessPredicate(this, options).addOption('isRange', options.isRange, async (harness, value) => {
      return (await harness.isRange()) === value;
    }).addOption('disabled', options.disabled, async (harness, disabled) => {
      return (await harness.isDisabled()) === disabled;
    });
  }
  async getStartThumb() {
    if (!(await this.isRange())) {
      throw Error('`getStartThumb` is only applicable for range sliders. ' + 'Did you mean to use `getEndThumb`?');
    }
    return this.locatorFor(MatSliderThumbHarness.with({
      position: ThumbPosition.START
    }))();
  }
  async getEndThumb() {
    return this.locatorFor(MatSliderThumbHarness.with({
      position: ThumbPosition.END
    }))();
  }
  async isRange() {
    return await (await this.host()).hasClass('mdc-slider--range');
  }
  async isDisabled() {
    return await (await this.host()).hasClass('mdc-slider--disabled');
  }
  async getStep() {
    const startHost = await (await this.getEndThumb()).host();
    return coerceNumberProperty(await startHost.getProperty('step'));
  }
  async getMaxValue() {
    return (await this.getEndThumb()).getMaxValue();
  }
  async getMinValue() {
    const startThumb = (await this.isRange()) ? await this.getStartThumb() : await this.getEndThumb();
    return startThumb.getMinValue();
  }
}

export { MatSliderHarness, MatSliderThumbHarness, ThumbPosition };
//# sourceMappingURL=slider-testing.mjs.map
