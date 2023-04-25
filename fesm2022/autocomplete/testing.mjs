import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptionHarness, MatOptgroupHarness } from '@angular/material/core/testing';

class _MatAutocompleteHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    /** Gets the value of the autocomplete input. */
    async getValue() {
        return (await this.host()).getProperty('value');
    }
    /** Whether the autocomplete input is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Focuses the autocomplete input. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the autocomplete input. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the autocomplete input is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Enters text into the autocomplete. */
    async enterText(value) {
        return (await this.host()).sendKeys(value);
    }
    /** Clears the input value. */
    async clear() {
        return (await this.host()).clear();
    }
    /** Gets the options inside the autocomplete panel. */
    async getOptions(filters) {
        if (!(await this.isOpen())) {
            throw new Error('Unable to retrieve options for autocomplete. Autocomplete panel is closed.');
        }
        return this._documentRootLocator.locatorForAll(this._optionClass.with({
            ...(filters || {}),
            ancestor: await this._getPanelSelector(),
        }))();
    }
    /** Gets the option groups inside the autocomplete panel. */
    async getOptionGroups(filters) {
        if (!(await this.isOpen())) {
            throw new Error('Unable to retrieve option groups for autocomplete. Autocomplete panel is closed.');
        }
        return this._documentRootLocator.locatorForAll(this._optionGroupClass.with({
            ...(filters || {}),
            ancestor: await this._getPanelSelector(),
        }))();
    }
    /** Selects the first option matching the given filters. */
    async selectOption(filters) {
        await this.focus(); // Focus the input to make sure the autocomplete panel is shown.
        const options = await this.getOptions(filters);
        if (!options.length) {
            throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
        }
        await options[0].click();
    }
    /** Whether the autocomplete is open. */
    async isOpen() {
        const panel = await this._getPanel();
        return !!panel && (await panel.hasClass(`${this._prefix}-autocomplete-visible`));
    }
    /** Gets the panel associated with this autocomplete trigger. */
    async _getPanel() {
        // Technically this is static, but it needs to be in a
        // function, because the autocomplete's panel ID can changed.
        return this._documentRootLocator.locatorForOptional(await this._getPanelSelector())();
    }
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    async _getPanelSelector() {
        return `#${await (await this.host()).getAttribute('aria-owns')}`;
    }
}
/** Harness for interacting with an MDC-based mat-autocomplete in tests. */
class MatAutocompleteHarness extends _MatAutocompleteHarnessBase {
    constructor() {
        super(...arguments);
        this._prefix = 'mat-mdc';
        this._optionClass = MatOptionHarness;
        this._optionGroupClass = MatOptgroupHarness;
    }
    /** The selector for the host element of a `MatAutocomplete` instance. */
    static { this.hostSelector = '.mat-mdc-autocomplete-trigger'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with specific
     * attributes.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value))
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    async _getPanelSelector() {
        return `#${await (await this.host()).getAttribute('aria-controls')}`;
    }
}

export { MatAutocompleteHarness, _MatAutocompleteHarnessBase };
//# sourceMappingURL=testing.mjs.map
