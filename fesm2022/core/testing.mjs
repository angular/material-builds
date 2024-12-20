import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-option` in tests. */
class MatOptionHarness extends ContentContainerComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector = '.mat-mdc-option';
    /** Element containing the option's text. */
    _text = this.locatorFor('.mdc-list-item__primary-text');
    /**
     * Gets a `HarnessPredicate` that can be used to search for an option with specific attributes.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, async (harness, title) => HarnessPredicate.stringMatches(await harness.getText(), title))
            .addOption('isSelected', options.isSelected, async (harness, isSelected) => (await harness.isSelected()) === isSelected);
    }
    /** Clicks the option. */
    async click() {
        return (await this.host()).click();
    }
    /** Gets the option's label text. */
    async getText() {
        return (await this._text()).text();
    }
    /** Gets whether the option is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mdc-list-item--disabled');
    }
    /** Gets whether the option is selected. */
    async isSelected() {
        return (await this.host()).hasClass('mdc-list-item--selected');
    }
    /** Gets whether the option is active. */
    async isActive() {
        return (await this.host()).hasClass('mat-mdc-option-active');
    }
    /** Gets whether the option is in multiple selection mode. */
    async isMultiple() {
        return (await this.host()).hasClass('mat-mdc-option-multiple');
    }
}

/** Harness for interacting with a `mat-optgroup` in tests. */
class MatOptgroupHarness extends ComponentHarness {
    /** Selector used to locate option group instances. */
    static hostSelector = '.mat-mdc-optgroup';
    _label = this.locatorFor('.mat-mdc-optgroup-label');
    /**
     * Gets a `HarnessPredicate` that can be used to search for a option group with specific
     * attributes.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('labelText', options.labelText, async (harness, title) => HarnessPredicate.stringMatches(await harness.getLabelText(), title));
    }
    /** Gets the option group's label text. */
    async getLabelText() {
        return (await this._label()).text();
    }
    /** Gets whether the option group is disabled. */
    async isDisabled() {
        return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
    }
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    async getOptions(filter = {}) {
        return this.locatorForAll(MatOptionHarness.with(filter))();
    }
}

export { MatOptgroupHarness, MatOptionHarness };
//# sourceMappingURL=testing.mjs.map
