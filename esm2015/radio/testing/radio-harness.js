/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard mat-radio-group in tests.
 * @dynamic
 */
export class MatRadioGroupHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-group with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a radio-group whose host element matches the given selector.
     *   - `name` finds a radio-group with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioGroupHarness, options)
            .addOption('name', options.name, this._checkRadioGroupName);
    }
    /** Gets the name of the radio-group. */
    getName() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('id');
        });
    }
    /** Gets the checked radio-button in a radio-group. */
    getCheckedRadioButton() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checkedRadio = yield this.getCheckedRadioButton();
            if (!checkedRadio) {
                return null;
            }
            return checkedRadio.getValue();
        });
    }
    /** Gets all radio buttons which are part of the radio-group. */
    getRadioButtons(filter = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatRadioButtonHarness.with(filter))();
        });
    }
    /** Checks a radio button in this group. */
    checkRadioButton(filter = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const radioButtons = yield this.getRadioButtons(filter);
            if (!radioButtons.length) {
                throw Error(`Could not find radio button matching ${JSON.stringify(filter)}`);
            }
            return radioButtons[0].check();
        });
    }
    _getGroupNameFromHost() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('name');
        });
    }
    _getNamesFromRadioButtons() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
MatRadioGroupHarness.hostSelector = 'mat-radio-group';
/**
 * Harness for interacting with a standard mat-radio-button in tests.
 * @dynamic
 */
export class MatRadioButtonHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-radio-label-content');
        this._clickLabel = this.locatorFor('.mat-radio-label');
        this._input = this.locatorFor('input');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio-button with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a radio-button whose host element matches the given selector.
     *   - `label` finds a radio-button with specific label text.
     *   - `name` finds a radio-button with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioButtonHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            .addOption('name', options.name, (harness, name) => tslib_1.__awaiter(this, void 0, void 0, function* () { return (yield harness.getName()) === name; }));
    }
    /** Whether the radio-button is checked. */
    isChecked() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checked = (yield this._input()).getProperty('checked');
            return coerceBooleanProperty(yield checked);
        });
    }
    /** Whether the radio-button is disabled. */
    isDisabled() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this._input()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Whether the radio-button is required. */
    isRequired() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const required = (yield this._input()).getAttribute('required');
            return coerceBooleanProperty(yield required);
        });
    }
    /** Gets a promise for the radio-button's name. */
    getName() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getAttribute('name');
        });
    }
    /** Gets a promise for the radio-button's id. */
    getId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('id');
        });
    }
    /**
     * Gets the value of the radio-button. The radio-button value will be
     * converted to a string.
     *
     * Note that this means that radio-button's with objects as value will
     * intentionally have the `[object Object]` as return value.
     */
    getValue() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getProperty('value');
        });
    }
    /** Gets a promise for the radio-button's label text. */
    getLabelText() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._textLabel()).text();
        });
    }
    /**
     * Focuses the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
    focus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).focus();
        });
    }
    /**
     * Blurs the radio-button and returns a void promise that indicates when the
     * action is complete.
     */
    blur() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).blur();
        });
    }
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked. Returns a void promise that indicates when
     * the action is complete.
     */
    check() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isChecked())) {
                return (yield this._clickLabel()).click();
            }
        });
    }
}
MatRadioButtonHarness.hostSelector = 'mat-radio-button';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFOzs7R0FHRztBQUNILE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxnQkFBZ0I7SUFHeEQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBb0MsRUFBRTtRQUNoRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDO2FBQ3JELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsd0NBQXdDO0lBQ2xDLE9BQU87O1lBQ1gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNwRCwrRUFBK0U7WUFDL0UsK0VBQStFO1lBQy9FLGtFQUFrRTtZQUNsRSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQ3JCLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1lBQ0QsMkVBQTJFO1lBQzNFLHlFQUF5RTtZQUN6RSw2QkFBNkI7WUFDN0IsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ2xELE1BQU0s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O0lBQ0csUUFBUTs7WUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEQsQ0FBQztLQUFBO0lBRUQsd0RBQXdEO0lBQ2xELFlBQVk7O1lBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLEtBQUs7O1lBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csSUFBSTs7WUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0csS0FBSzs7WUFDVCxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO2dCQUM3QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUMzQztRQUNILENBQUM7S0FBQTs7QUE3Rk0sa0NBQVksR0FBRyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzLCBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcmFkaW8taGFybmVzcy1maWx0ZXJzJztcblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXJhZGlvLWdyb3VwIGluIHRlc3RzLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSByYWRpby1ncm91cCB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIHJhZGlvLWdyb3VwIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBuYW1lYCBmaW5kcyBhIHJhZGlvLWdyb3VwIHdpdGggc3BlY2lmaWMgbmFtZS5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0UmFkaW9Hcm91cEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0UmFkaW9Hcm91cEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ25hbWUnLCBvcHRpb25zLm5hbWUsIHRoaXMuX2NoZWNrUmFkaW9Hcm91cE5hbWUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBob3N0TmFtZSA9IGF3YWl0IHRoaXMuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCk7XG4gICAgLy8gSXQncyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nXG4gICAgLy8gdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyBiZWNhdXNlIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuXG4gICAgLy8gZWxlbWVudCBhdHRyaWJ1dGUgaWYgdGhlIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoaG9zdE5hbWUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBob3N0TmFtZTtcbiAgICB9XG4gICAgLy8gSW4gY2FzZSB3ZSBjb3VsZG4ndCBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGVcbiAgICAvLyBcIm5hbWVcIiBhdHRyaWJ1dGUsIHdlIHRyeSB0byBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIHRoZSBncm91cCBieSBnb2luZ1xuICAgIC8vIHRocm91Z2ggYWxsIHJhZGlvIGJ1dHRvbnMuXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IHRoaXMuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmICghcmFkaW9OYW1lcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1JhZGlvIGJ1dHRvbnMgaW4gcmFkaW8tZ3JvdXAgaGF2ZSBtaXNtYXRjaGluZyBuYW1lcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvTmFtZXNbMF0hO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgcmFkaW8tYnV0dG9uIGluIGEgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldENoZWNrZWRSYWRpb0J1dHRvbigpOiBQcm9taXNlPE1hdFJhZGlvQnV0dG9uSGFybmVzc3xudWxsPiB7XG4gICAgZm9yIChsZXQgcmFkaW9CdXR0b24gb2YgYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoKSkge1xuICAgICAgaWYgKGF3YWl0IHJhZGlvQnV0dG9uLmlzQ2hlY2tlZCgpKSB7XG4gICAgICAgIHJldHVybiByYWRpb0J1dHRvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCB2YWx1ZSBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldENoZWNrZWRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgY2hlY2tlZFJhZGlvID0gYXdhaXQgdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24oKTtcbiAgICBpZiAoIWNoZWNrZWRSYWRpbykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjaGVja2VkUmFkaW8uZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCByYWRpbyBidXR0b25zIHdoaWNoIGFyZSBwYXJ0IG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0UmFkaW9CdXR0b25zKGZpbHRlcjogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRSYWRpb0J1dHRvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0UmFkaW9CdXR0b25IYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgYSByYWRpbyBidXR0b24gaW4gdGhpcyBncm91cC4gKi9cbiAgYXN5bmMgY2hlY2tSYWRpb0J1dHRvbihmaWx0ZXI6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJhZGlvQnV0dG9ucyA9IGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKGZpbHRlcik7XG4gICAgaWYgKCFyYWRpb0J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgcmFkaW8gYnV0dG9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvQnV0dG9uc1swXS5jaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGdyb3VwTmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgcmFkaW8gb2YgYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoKSkge1xuICAgICAgY29uc3QgcmFkaW9OYW1lID0gYXdhaXQgcmFkaW8uZ2V0TmFtZSgpO1xuICAgICAgaWYgKHJhZGlvTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWVzLnB1c2gocmFkaW9OYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdyb3VwTmFtZXM7XG4gIH1cblxuICAvKiogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgcmFkaW8gbmFtZXMgYXJlIGFsbCBlcXVhbC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgbGV0IGdyb3VwTmFtZTogc3RyaW5nfG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IHJhZGlvTmFtZSBvZiByYWRpb05hbWVzKSB7XG4gICAgICBpZiAoZ3JvdXBOYW1lID09PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IHJhZGlvTmFtZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lICE9PSByYWRpb05hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSByYWRpby1ncm91cCBoYXJuZXNzIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gVGhyb3dzIGlmIGEgcmFkaW8tZ3JvdXAgd2l0aFxuICAgKiBtYXRjaGluZyBuYW1lIGNvdWxkIGJlIGZvdW5kIGJ1dCBoYXMgbWlzbWF0Y2hpbmcgcmFkaW8tYnV0dG9uIG5hbWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgX2NoZWNrUmFkaW9Hcm91cE5hbWUoaGFybmVzczogTWF0UmFkaW9Hcm91cEhhcm5lc3MsIG5hbWU6IHN0cmluZykge1xuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgcmFkaW8tZ3JvdXAgd2hpY2ggaGFzIHRoZSBcIm5hbWVcIiBhdHRyaWJ1dGUgc2V0XG4gICAgLy8gdG8gdGhlIGV4cGVjdGVkIGdyb3VwIG5hbWUuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmVcbiAgICAvLyB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZVxuICAgIC8vIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoYXdhaXQgaGFybmVzcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgZ3JvdXAgd2l0aCByYWRpby1idXR0b25zIHRoYXQgYWxsIGhhdmUgdGhlIHNhbWVcbiAgICAvLyBleHBlY3RlZCBuYW1lLiBUaGlzIGltcGxpZXMgdGhhdCB0aGUgZ3JvdXAgaGFzIHRoZSBnaXZlbiBuYW1lLiBJdCdzXG4gICAgLy8gbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmUgdGhlIG5hbWUgb2YgYSByYWRpby1ncm91cCB0aHJvdWdoXG4gICAgLy8gdGhlIGF0dHJpYnV0ZSBiZWNhdXNlIHRoZXJlIGlzXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IGhhcm5lc3MuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmIChyYWRpb05hbWVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaGFybmVzcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgVGhlIGxvY2F0b3IgZm91bmQgYSByYWRpby1ncm91cCB3aXRoIG5hbWUgXCIke25hbWV9XCIsIGJ1dCBzb21lIGAgK1xuICAgICAgICAgIGByYWRpby1idXR0b24ncyB3aXRoaW4gdGhlIGdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMsIHdoaWNoIGlzIGludmFsaWQuYCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1idXR0b24gaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWJ1dHRvbic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgcmFkaW8tYnV0dG9uIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgc2VsZWN0b3JgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGBsYWJlbGAgZmluZHMgYSByYWRpby1idXR0b24gd2l0aCBzcGVjaWZpYyBsYWJlbCB0ZXh0LlxuICAgKiAgIC0gYG5hbWVgIGZpbmRzIGEgcmFkaW8tYnV0dG9uIHdpdGggc3BlY2lmaWMgbmFtZS5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvQnV0dG9uSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0J1dHRvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnbGFiZWwnLCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbC1jb250ZW50Jyk7XG4gIHByaXZhdGUgX2NsaWNrTGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcmFkaW8tbGFiZWwnKTtcbiAgcHJpdmF0ZSBfaW5wdXQgPSB0aGlzLmxvY2F0b3JGb3IoJ2lucHV0Jyk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgnY2hlY2tlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgY2hlY2tlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgcmVxdWlyZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIHJhZGlvLWJ1dHRvbi4gVGhlIHJhZGlvLWJ1dHRvbiB2YWx1ZSB3aWxsIGJlXG4gICAqIGNvbnZlcnRlZCB0byBhIHN0cmluZy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgbWVhbnMgdGhhdCByYWRpby1idXR0b24ncyB3aXRoIG9iamVjdHMgYXMgdmFsdWUgd2lsbFxuICAgKiBpbnRlbnRpb25hbGx5IGhhdmUgdGhlIGBbb2JqZWN0IE9iamVjdF1gIGFzIHJldHVybiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5KCd2YWx1ZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgcmFkaW8tYnV0dG9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWxUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl90ZXh0TGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHJhZGlvLWJ1dHRvbiBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbiBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIHJhZGlvLWJ1dHRvbiBpbiBhIGNoZWNrZWQgc3RhdGUgYnkgY2xpY2tpbmcgaXQgaWYgaXQgaXMgY3VycmVudGx5IHVuY2hlY2tlZCxcbiAgICogb3IgZG9pbmcgbm90aGluZyBpZiBpdCBpcyBhbHJlYWR5IGNoZWNrZWQuIFJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlblxuICAgKiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY2xpY2tMYWJlbCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxufVxuIl19