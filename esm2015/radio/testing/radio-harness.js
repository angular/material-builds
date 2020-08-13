/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-radio-group in tests. */
export class MatRadioGroupHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioGroupHarness, options)
            .addOption('name', options.name, this._checkRadioGroupName);
    }
    /** Gets the name of the radio-group. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostName = yield this._getGroupNameFromHost();
            // It's not possible to always determine the "name" of a radio-group by reading
            // the attribute. This is because the radio-group does not set the "name" as an
            // element attribute if the "name" value is set through a binding.
            if (hostName !== null) {
                return hostName;
            }
            // In case we couldn't determine the "name" of a radio-group by reading the
            // "name" attribute, we try to determine the "name" of the group by going
            // through all radio buttons.
            const radioNames = yield this._getNamesFromRadioButtons();
            if (!radioNames.length) {
                return null;
            }
            if (!this._checkRadioNamesInGroupEqual(radioNames)) {
                throw Error('Radio buttons in radio-group have mismatching names.');
            }
            return radioNames[0];
        });
    }
    /** Gets the id of the radio-group. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('id');
        });
    }
    /** Gets the checked radio-button in a radio-group. */
    getCheckedRadioButton() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let radioButton of yield this.getRadioButtons()) {
                if (yield radioButton.isChecked()) {
                    return radioButton;
                }
            }
            return null;
        });
    }
    /** Gets the checked value of the radio-group. */
    getCheckedValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const checkedRadio = yield this.getCheckedRadioButton();
            if (!checkedRadio) {
                return null;
            }
            return checkedRadio.getValue();
        });
    }
    /**
     * Gets a list of radio buttons which are part of the radio-group.
     * @param filter Optionally filters which radio buttons are included.
     */
    getRadioButtons(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatRadioButtonHarness.with(filter))();
        });
    }
    /**
     * Checks a radio button in this group.
     * @param filter An optional filter to apply to the child radio buttons. The first tab matching
     *     the filter will be selected.
     */
    checkRadioButton(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const radioButtons = yield this.getRadioButtons(filter);
            if (!radioButtons.length) {
                throw Error(`Could not find radio button matching ${JSON.stringify(filter)}`);
            }
            return radioButtons[0].check();
        });
    }
    /** Gets the name attribute of the host element. */
    _getGroupNameFromHost() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('name');
        });
    }
    /** Gets a list of the name attributes of all child radio buttons. */
    _getNamesFromRadioButtons() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNames = [];
            for (let radio of yield this.getRadioButtons()) {
                const radioName = yield radio.getName();
                if (radioName !== null) {
                    groupNames.push(radioName);
                }
            }
            return groupNames;
        });
    }
    /** Checks if the specified radio names are all equal. */
    _checkRadioNamesInGroupEqual(radioNames) {
        let groupName = null;
        for (let radioName of radioNames) {
            if (groupName === null) {
                groupName = radioName;
            }
            else if (groupName !== radioName) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if a radio-group harness has the given name. Throws if a radio-group with
     * matching name could be found but has mismatching radio-button names.
     */
    static _checkRadioGroupName(harness, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if there is a radio-group which has the "name" attribute set
            // to the expected group name. It's not possible to always determine
            // the "name" of a radio-group by reading the attribute. This is because
            // the radio-group does not set the "name" as an element attribute if the
            // "name" value is set through a binding.
            if ((yield harness._getGroupNameFromHost()) === name) {
                return true;
            }
            // Check if there is a group with radio-buttons that all have the same
            // expected name. This implies that the group has the given name. It's
            // not possible to always determine the name of a radio-group through
            // the attribute because there is
            const radioNames = yield harness._getNamesFromRadioButtons();
            if (radioNames.indexOf(name) === -1) {
                return false;
            }
            if (!harness._checkRadioNamesInGroupEqual(radioNames)) {
                throw Error(`The locator found a radio-group with name "${name}", but some ` +
                    `radio-button's within the group have mismatching names, which is invalid.`);
            }
            return true;
        });
    }
}
/** The selector for the host element of a `MatRadioGroup` instance. */
MatRadioGroupHarness.hostSelector = '.mat-radio-group';
/** Harness for interacting with a standard mat-radio-button in tests. */
export class MatRadioButtonHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-radio-label-content');
        this._clickLabel = this.locatorFor('.mat-radio-label');
        this._input = this.locatorFor('input');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioButtonHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio button instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioButtonHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            .addOption('name', options.name, (harness, name) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getName()) === name; }));
    }
    /** Whether the radio-button is checked. */
    isChecked() {
        return __awaiter(this, void 0, void 0, function* () {
            const checked = (yield this._input()).getProperty('checked');
            return coerceBooleanProperty(yield checked);
        });
    }
    /** Whether the radio-button is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this._input()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Whether the radio-button is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            const required = (yield this._input()).getAttribute('required');
            return coerceBooleanProperty(yield required);
        });
    }
    /** Gets the radio-button's name. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getAttribute('name');
        });
    }
    /** Gets the radio-button's id. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('id');
        });
    }
    /**
     * Gets the value of the radio-button. The radio-button value will be converted to a string.
     *
     * Note: This means that for radio-button's with an object as a value `[object Object]` is
     * intentionally returned.
     */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getProperty('value');
        });
    }
    /** Gets the radio-button's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._textLabel()).text();
        });
    }
    /** Focuses the radio-button. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).focus();
        });
    }
    /** Blurs the radio-button. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).blur();
        });
    }
    /** Whether the radio-button is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).isFocused();
        });
    }
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked.
     */
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isChecked())) {
                return (yield this._clickLabel()).click();
            }
        });
    }
}
/** The selector for the host element of a `MatRadioButton` instance. */
MatRadioButtonHarness.hostSelector = '.mat-radio-button';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHdFQUF3RTtBQUN4RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsZ0JBQWdCO0lBSXhEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFvQyxFQUFFO1FBQ2hELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7YUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCx3Q0FBd0M7SUFDbEMsT0FBTzs7WUFDWCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3BELCtFQUErRTtZQUMvRSwrRUFBK0U7WUFDL0Usa0VBQWtFO1lBQ2xFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDckIsT0FBTyxRQUFRLENBQUM7YUFDakI7WUFDRCwyRUFBMkU7WUFDM0UseUVBQXlFO1lBQ3pFLDZCQUE2QjtZQUM3QixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUN0QixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDbEQsTUFBTSxL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Q0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNHLFFBQVE7O1lBQ1osT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FBQTtJQUVELDBDQUEwQztJQUNwQyxZQUFZOztZQUNoQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxDQUFDO0tBQUE7SUFFRCxnQ0FBZ0M7SUFDMUIsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QyxDQUFDO0tBQUE7SUFFRCw4QkFBOEI7SUFDeEIsSUFBSTs7WUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFRCwyQ0FBMkM7SUFDckMsU0FBUzs7WUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxLQUFLOztZQUNULElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUU7Z0JBQzdCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzNDO1FBQ0gsQ0FBQztLQUFBOztBQXhGRCx3RUFBd0U7QUFDakUsa0NBQVksR0FBRyxtQkFBbUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzLCBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcmFkaW8taGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcmFkaW8tZ3JvdXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRSYWRpb0dyb3VwYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXJhZGlvLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0UmFkaW9Hcm91cEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHJhZGlvIGdyb3VwIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRSYWRpb0dyb3VwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0dyb3VwSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbmFtZScsIG9wdGlvbnMubmFtZSwgdGhpcy5fY2hlY2tSYWRpb0dyb3VwTmFtZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGhvc3ROYW1lID0gYXdhaXQgdGhpcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKTtcbiAgICAvLyBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmdcbiAgICAvLyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2UgdGhlIHJhZGlvLWdyb3VwIGRvZXMgbm90IHNldCB0aGUgXCJuYW1lXCIgYXMgYW5cbiAgICAvLyBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGUgXCJuYW1lXCIgdmFsdWUgaXMgc2V0IHRocm91Z2ggYSBiaW5kaW5nLlxuICAgIGlmIChob3N0TmFtZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGhvc3ROYW1lO1xuICAgIH1cbiAgICAvLyBJbiBjYXNlIHdlIGNvdWxkbid0IGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZVxuICAgIC8vIFwibmFtZVwiIGF0dHJpYnV0ZSwgd2UgdHJ5IHRvIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgdGhlIGdyb3VwIGJ5IGdvaW5nXG4gICAgLy8gdGhyb3VnaCBhbGwgcmFkaW8gYnV0dG9ucy5cbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgdGhpcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKCFyYWRpb05hbWVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcignUmFkaW8gYnV0dG9ucyBpbiByYWRpby1ncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLicpO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9OYW1lc1swXSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCByYWRpby1idXR0b24gaW4gYSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzfG51bGw+IHtcbiAgICBmb3IgKGxldCByYWRpb0J1dHRvbiBvZiBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucygpKSB7XG4gICAgICBpZiAoYXdhaXQgcmFkaW9CdXR0b24uaXNDaGVja2VkKCkpIHtcbiAgICAgICAgcmV0dXJuIHJhZGlvQnV0dG9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2VkIHZhbHVlIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tlZFZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBjaGVja2VkUmFkaW8gPSBhd2FpdCB0aGlzLmdldENoZWNrZWRSYWRpb0J1dHRvbigpO1xuICAgIGlmICghY2hlY2tlZFJhZGlvKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrZWRSYWRpby5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIHJhZGlvIGJ1dHRvbnMgd2hpY2ggYXJlIHBhcnQgb2YgdGhlIHJhZGlvLWdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCByYWRpbyBidXR0b25zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldFJhZGlvQnV0dG9ucyhmaWx0ZXI6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFJhZGlvQnV0dG9uSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGEgcmFkaW8gYnV0dG9uIGluIHRoaXMgZ3JvdXAuXG4gICAqIEBwYXJhbSBmaWx0ZXIgQW4gb3B0aW9uYWwgZmlsdGVyIHRvIGFwcGx5IHRvIHRoZSBjaGlsZCByYWRpbyBidXR0b25zLiBUaGUgZmlyc3QgdGFiIG1hdGNoaW5nXG4gICAqICAgICB0aGUgZmlsdGVyIHdpbGwgYmUgc2VsZWN0ZWQuXG4gICAqL1xuICBhc3luYyBjaGVja1JhZGlvQnV0dG9uKGZpbHRlcjogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmFkaW9CdXR0b25zID0gYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoZmlsdGVyKTtcbiAgICBpZiAoIXJhZGlvQnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCByYWRpbyBidXR0b24gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9CdXR0b25zWzBdLmNoZWNrKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBhdHRyaWJ1dGUgb2YgdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGxpc3Qgb2YgdGhlIG5hbWUgYXR0cmlidXRlcyBvZiBhbGwgY2hpbGQgcmFkaW8gYnV0dG9ucy4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBncm91cE5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IHJhZGlvIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGNvbnN0IHJhZGlvTmFtZSA9IGF3YWl0IHJhZGlvLmdldE5hbWUoKTtcbiAgICAgIGlmIChyYWRpb05hbWUgIT09IG51bGwpIHtcbiAgICAgICAgZ3JvdXBOYW1lcy5wdXNoKHJhZGlvTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBncm91cE5hbWVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyBpZiB0aGUgc3BlY2lmaWVkIHJhZGlvIG5hbWVzIGFyZSBhbGwgZXF1YWwuICovXG4gIHByaXZhdGUgX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBncm91cE5hbWU6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCByYWRpb05hbWUgb2YgcmFkaW9OYW1lcykge1xuICAgICAgaWYgKGdyb3VwTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWUgPSByYWRpb05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSAhPT0gcmFkaW9OYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcmFkaW8tZ3JvdXAgaGFybmVzcyBoYXMgdGhlIGdpdmVuIG5hbWUuIFRocm93cyBpZiBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogbWF0Y2hpbmcgbmFtZSBjb3VsZCBiZSBmb3VuZCBidXQgaGFzIG1pc21hdGNoaW5nIHJhZGlvLWJ1dHRvbiBuYW1lcy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGFzeW5jIF9jaGVja1JhZGlvR3JvdXBOYW1lKGhhcm5lc3M6IE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHJhZGlvLWdyb3VwIHdoaWNoIGhhcyB0aGUgXCJuYW1lXCIgYXR0cmlidXRlIHNldFxuICAgIC8vIHRvIHRoZSBleHBlY3RlZCBncm91cCBuYW1lLiBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lXG4gICAgLy8gdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAvLyB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhbiBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGVcbiAgICAvLyBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGF3YWl0IGhhcm5lc3MuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIGdyb3VwIHdpdGggcmFkaW8tYnV0dG9ucyB0aGF0IGFsbCBoYXZlIHRoZSBzYW1lXG4gICAgLy8gZXhwZWN0ZWQgbmFtZS4gVGhpcyBpbXBsaWVzIHRoYXQgdGhlIGdyb3VwIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gSXQnc1xuICAgIC8vIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBuYW1lIG9mIGEgcmFkaW8tZ3JvdXAgdGhyb3VnaFxuICAgIC8vIHRoZSBhdHRyaWJ1dGUgYmVjYXVzZSB0aGVyZSBpc1xuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCBoYXJuZXNzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAocmFkaW9OYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWhhcm5lc3MuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYFRoZSBsb2NhdG9yIGZvdW5kIGEgcmFkaW8tZ3JvdXAgd2l0aCBuYW1lIFwiJHtuYW1lfVwiLCBidXQgc29tZSBgICtcbiAgICAgICAgICBgcmFkaW8tYnV0dG9uJ3Mgd2l0aGluIHRoZSBncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLCB3aGljaCBpcyBpbnZhbGlkLmApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1idXR0b24gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0UmFkaW9CdXR0b25gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcmFkaW8tYnV0dG9uJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0UmFkaW9CdXR0b25IYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCByYWRpbyBidXR0b24gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UmFkaW9CdXR0b25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSlcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAgICduYW1lJywgb3B0aW9ucy5uYW1lLCBhc3luYyAoaGFybmVzcywgbmFtZSkgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0TmFtZSgpKSA9PT0gbmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF90ZXh0TGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcmFkaW8tbGFiZWwtY29udGVudCcpO1xuICBwcml2YXRlIF9jbGlja0xhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXJhZGlvLWxhYmVsJyk7XG4gIHByaXZhdGUgX2lucHV0ID0gdGhpcy5sb2NhdG9yRm9yKCdpbnB1dCcpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgY2hlY2tlZC4gKi9cbiAgYXN5bmMgaXNDaGVja2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGNoZWNrZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0UHJvcGVydHkoJ2NoZWNrZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGNoZWNrZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IHJlcXVpcmVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByYWRpby1idXR0b24ncyBuYW1lLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHJhZGlvLWJ1dHRvbi4gVGhlIHJhZGlvLWJ1dHRvbiB2YWx1ZSB3aWxsIGJlIGNvbnZlcnRlZCB0byBhIHN0cmluZy5cbiAgICpcbiAgICogTm90ZTogVGhpcyBtZWFucyB0aGF0IGZvciByYWRpby1idXR0b24ncyB3aXRoIGFuIG9iamVjdCBhcyBhIHZhbHVlIGBbb2JqZWN0IE9iamVjdF1gIGlzXG4gICAqIGludGVudGlvbmFsbHkgcmV0dXJuZWQuXG4gICAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByYWRpby1idXR0b24ncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RleHRMYWJlbCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcmFkaW8tYnV0dG9uLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbi4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgcmFkaW8tYnV0dG9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSBjbGlja2luZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLFxuICAgKiBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NsaWNrTGFiZWwoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==