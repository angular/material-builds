import { __awaiter } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatOptionHarness, MatOptgroupHarness } from '@angular/material/core/testing';

class _MatAutocompleteHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    /** Gets the value of the autocomplete input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('value');
        });
    }
    /** Whether the autocomplete input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Focuses the autocomplete input. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the autocomplete input. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the autocomplete input is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Enters text into the autocomplete. */
    enterText(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).sendKeys(value);
        });
    }
    /** Clears the input value. */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).clear();
        });
    }
    /** Gets the options inside the autocomplete panel. */
    getOptions(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isOpen())) {
                throw new Error('Unable to retrieve options for autocomplete. Autocomplete panel is closed.');
            }
            return this._documentRootLocator.locatorForAll(this._optionClass.with(Object.assign(Object.assign({}, (filters || {})), { ancestor: yield this._getPanelSelector() })))();
        });
    }
    /** Gets the option groups inside the autocomplete panel. */
    getOptionGroups(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isOpen())) {
                throw new Error('Unable to retrieve option groups for autocomplete. Autocomplete panel is closed.');
            }
            return this._documentRootLocator.locatorForAll(this._optionGroupClass.with(Object.assign(Object.assign({}, (filters || {})), { ancestor: yield this._getPanelSelector() })))();
        });
    }
    /** Selects the first option matching the given filters. */
    selectOption(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.focus(); // Focus the input to make sure the autocomplete panel is shown.
            const options = yield this.getOptions(filters);
            if (!options.length) {
                throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
            }
            yield options[0].click();
        });
    }
    /** Whether the autocomplete is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._getPanel();
            return !!panel && (yield panel.hasClass(`${this._prefix}-autocomplete-visible`));
        });
    }
    /** Gets the panel associated with this autocomplete trigger. */
    _getPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            // Technically this is static, but it needs to be in a
            // function, because the autocomplete's panel ID can changed.
            return this._documentRootLocator.locatorForOptional(yield this._getPanelSelector())();
        });
    }
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    _getPanelSelector() {
        return __awaiter(this, void 0, void 0, function* () {
            return `#${yield (yield this.host()).getAttribute('aria-owns')}`;
        });
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
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with specific
     * attributes.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value))
            .addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isDisabled()) === disabled;
        }));
    }
}
/** The selector for the host element of a `MatAutocomplete` instance. */
MatAutocompleteHarness.hostSelector = '.mat-mdc-autocomplete-trigger';

export { MatAutocompleteHarness, _MatAutocompleteHarnessBase };
//# sourceMappingURL=testing.mjs.map
