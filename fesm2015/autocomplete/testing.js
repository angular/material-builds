import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Harness for interacting with a the `mat-option` for a `mat-autocomplete` in tests.
 * @dynamic
 */
class MatAutocompleteOptionHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionHarness, options)
            .addOption('text', options.text, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getText(), title); }));
    }
    /** Clicks the option. */
    click() {
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
/**
 * Harness for interacting with a the `mat-optgroup` for a `mat-autocomplete` in tests.
 * @dynamic
 */
class MatAutocompleteOptionGroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-optgroup-label');
    }
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteOptionGroupHarness, options)
            .addOption('labelText', options.labelText, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getLabelText(), title); }));
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
/**
 * Harness for interacting with a standard mat-autocomplete in tests.
 * @dynamic
 */
class MatAutocompleteHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._panel = this._documentRootLocator.locatorFor(PANEL_SELECTOR);
        this._optionalPanel = this._documentRootLocator.locatorForOptional(PANEL_SELECTOR);
        this._options = this._documentRootLocator.locatorForAll(MatAutocompleteOptionHarness);
        this._groups = this._documentRootLocator.locatorForAll(MatAutocompleteOptionGroupHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an autocomplete with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `name` finds an autocomplete with a specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteHarness, options);
    }
    getAttribute(attributeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute(attributeName);
        });
    }
    /** Gets a boolean promise indicating if the autocomplete input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets a promise for the autocomplete's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('value');
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
    /** Gets the autocomplete panel. */
    getPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._panel();
        });
    }
    /** Gets the options inside the autocomplete panel. */
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._options();
        });
    }
    /** Gets the groups of options inside the panel. */
    getOptionGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._groups();
        });
    }
    /** Gets whether the autocomplete panel is visible. */
    isPanelVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._panel()).hasClass('mat-autocomplete-visible');
        });
    }
    /** Gets whether the autocomplete is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._optionalPanel());
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
