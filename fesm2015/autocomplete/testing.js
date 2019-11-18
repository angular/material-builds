import { __awaiter } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests. */
class MatAutocompleteOptionHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Clicks the option. */
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Gets a promise for the option's label text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
}
MatAutocompleteOptionHarness.hostSelector = '.mat-autocomplete-panel .mat-option';
/** Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests. */
class MatAutocompleteOptionGroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-optgroup-label');
    }
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label));
    }
    /** Gets a promise for the option group's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
}
MatAutocompleteOptionGroupHarness.hostSelector = '.mat-autocomplete-panel .mat-optgroup';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Selector for the autocomplete panel. */
const PANEL_SELECTOR = '.mat-autocomplete-panel';
/** Harness for interacting with a standard mat-autocomplete in tests. */
class MatAutocompleteHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._optionalPanel = this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteHarness, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value));
    }
    /** Gets the value of the autocomplete input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('value');
        });
    }
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Focuses the input and returns a void promise that indicates when the action is complete. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the input and returns a void promise that indicates when the action is complete. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Enters text into the autocomplete. */
    enterText(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).sendKeys(value);
        });
    }
    /** Gets the options inside the autocomplete panel. */
    getOptions(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness.with(filters))();
        });
    }
    /** Gets the groups of options inside the panel. */
    getOptionGroups(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatAutocompleteOptionGroupHarness.with(filters))();
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
            yield options[0].select();
        });
    }
    /** Gets whether the autocomplete is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._optionalPanel();
            return !!panel && (yield panel.hasClass('mat-autocomplete-visible'));
        });
    }
}
MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatAutocompleteHarness };
//# sourceMappingURL=testing.js.map
