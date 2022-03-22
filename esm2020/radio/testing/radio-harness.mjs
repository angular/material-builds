/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
export class _MatRadioGroupHarnessBase extends ComponentHarness {
    /** Gets the name of the radio-group. */
    async getName() {
        const hostName = await this._getGroupNameFromHost();
        // It's not possible to always determine the "name" of a radio-group by reading
        // the attribute. This is because the radio-group does not set the "name" as an
        // element attribute if the "name" value is set through a binding.
        if (hostName !== null) {
            return hostName;
        }
        // In case we couldn't determine the "name" of a radio-group by reading the
        // "name" attribute, we try to determine the "name" of the group by going
        // through all radio buttons.
        const radioNames = await this._getNamesFromRadioButtons();
        if (!radioNames.length) {
            return null;
        }
        if (!this._checkRadioNamesInGroupEqual(radioNames)) {
            throw Error('Radio buttons in radio-group have mismatching names.');
        }
        return radioNames[0];
    }
    /** Gets the id of the radio-group. */
    async getId() {
        return (await this.host()).getProperty('id');
    }
    /** Gets the checked radio-button in a radio-group. */
    async getCheckedRadioButton() {
        for (let radioButton of await this.getRadioButtons()) {
            if (await radioButton.isChecked()) {
                return radioButton;
            }
        }
        return null;
    }
    /** Gets the checked value of the radio-group. */
    async getCheckedValue() {
        const checkedRadio = await this.getCheckedRadioButton();
        if (!checkedRadio) {
            return null;
        }
        return checkedRadio.getValue();
    }
    /**
     * Gets a list of radio buttons which are part of the radio-group.
     * @param filter Optionally filters which radio buttons are included.
     */
    async getRadioButtons(filter) {
        return this.locatorForAll(this._buttonClass.with(filter))();
    }
    /**
     * Checks a radio button in this group.
     * @param filter An optional filter to apply to the child radio buttons. The first tab matching
     *     the filter will be selected.
     */
    async checkRadioButton(filter) {
        const radioButtons = await this.getRadioButtons(filter);
        if (!radioButtons.length) {
            throw Error(`Could not find radio button matching ${JSON.stringify(filter)}`);
        }
        return radioButtons[0].check();
    }
    /** Gets the name attribute of the host element. */
    async _getGroupNameFromHost() {
        return (await this.host()).getAttribute('name');
    }
    /** Gets a list of the name attributes of all child radio buttons. */
    async _getNamesFromRadioButtons() {
        const groupNames = [];
        for (let radio of await this.getRadioButtons()) {
            const radioName = await radio.getName();
            if (radioName !== null) {
                groupNames.push(radioName);
            }
        }
        return groupNames;
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
    static async _checkRadioGroupName(harness, name) {
        // Check if there is a radio-group which has the "name" attribute set
        // to the expected group name. It's not possible to always determine
        // the "name" of a radio-group by reading the attribute. This is because
        // the radio-group does not set the "name" as an element attribute if the
        // "name" value is set through a binding.
        if ((await harness._getGroupNameFromHost()) === name) {
            return true;
        }
        // Check if there is a group with radio-buttons that all have the same
        // expected name. This implies that the group has the given name. It's
        // not possible to always determine the name of a radio-group through
        // the attribute because there is
        const radioNames = await harness._getNamesFromRadioButtons();
        if (radioNames.indexOf(name) === -1) {
            return false;
        }
        if (!harness._checkRadioNamesInGroupEqual(radioNames)) {
            throw Error(`The locator found a radio-group with name "${name}", but some ` +
                `radio-button's within the group have mismatching names, which is invalid.`);
        }
        return true;
    }
}
/** Harness for interacting with a standard mat-radio-group in tests. */
export class MatRadioGroupHarness extends _MatRadioGroupHarnessBase {
    constructor() {
        super(...arguments);
        this._buttonClass = MatRadioButtonHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatRadioGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatRadioGroupHarness, options).addOption('name', options.name, this._checkRadioGroupName);
    }
}
/** The selector for the host element of a `MatRadioGroup` instance. */
MatRadioGroupHarness.hostSelector = '.mat-radio-group';
export class _MatRadioButtonHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._input = this.locatorFor('input');
    }
    /** Whether the radio-button is checked. */
    async isChecked() {
        const checked = (await this._input()).getProperty('checked');
        return coerceBooleanProperty(await checked);
    }
    /** Whether the radio-button is disabled. */
    async isDisabled() {
        const disabled = (await this._input()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the radio-button is required. */
    async isRequired() {
        const required = (await this._input()).getAttribute('required');
        return coerceBooleanProperty(await required);
    }
    /** Gets the radio-button's name. */
    async getName() {
        return (await this._input()).getAttribute('name');
    }
    /** Gets the radio-button's id. */
    async getId() {
        return (await this.host()).getProperty('id');
    }
    /**
     * Gets the value of the radio-button. The radio-button value will be converted to a string.
     *
     * Note: This means that for radio-button's with an object as a value `[object Object]` is
     * intentionally returned.
     */
    async getValue() {
        return (await this._input()).getProperty('value');
    }
    /** Gets the radio-button's label text. */
    async getLabelText() {
        return (await this._textLabel()).text();
    }
    /** Focuses the radio-button. */
    async focus() {
        return (await this._input()).focus();
    }
    /** Blurs the radio-button. */
    async blur() {
        return (await this._input()).blur();
    }
    /** Whether the radio-button is focused. */
    async isFocused() {
        return (await this._input()).isFocused();
    }
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked.
     */
    async check() {
        if (!(await this.isChecked())) {
            return (await this._clickLabel()).click();
        }
    }
}
/** Harness for interacting with a standard mat-radio-button in tests. */
export class MatRadioButtonHarness extends _MatRadioButtonHarnessBase {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-radio-label-content');
        this._clickLabel = this.locatorFor('.mat-radio-label');
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
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked);
    }
}
/** The selector for the host element of a `MatRadioButton` instance. */
MatRadioButtonHarness.hostSelector = '.mat-radio-button';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUdMLGdCQUFnQixFQUVoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5QixNQUFNLE9BQWdCLHlCQVdwQixTQUFRLGdCQUFnQjtJQUd4Qix3Q0FBd0M7SUFDeEMsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3BELCtFQUErRTtRQUMvRSwrRUFBK0U7UUFDL0Usa0VBQWtFO1FBQ2xFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNyQixPQUFPLFFBQVEsQ0FBQztTQUNqQjtRQUNELDJFQUEyRTtRQUMzRSx5RUFBeUU7UUFDekUsNkJBQTZCO1FBQzdCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbEQsTUFBTSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUNyRTtRQUNELE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLEtBQUs7UUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQWdCLElBQUksQ0FBQyxDQUFDO0lB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SyxJQUFJLENBQUM7YUFDNUYsU0FBUyxDQUNSLFNBQVMsRUFDVCxPQUFPLENBQUMsT0FBTyxFQUNmLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUNuRSxDQUFDO0lBQ04sQ0FBQzs7QUFwQkQsd0VBQXdFO0FBQ2pFLGtDQUFZLEdBQUcsbUJBQW1CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIFRlc3RFbGVtZW50LFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1JhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMsIFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9yYWRpby1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFJhZGlvR3JvdXBIYXJuZXNzQmFzZTxcbiAgQnV0dG9uVHlwZSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxCdXR0b24+ICYge1xuICAgIHdpdGg6IChvcHRpb25zPzogQnV0dG9uRmlsdGVycykgPT4gSGFybmVzc1ByZWRpY2F0ZTxCdXR0b24+O1xuICB9LFxuICBCdXR0b24gZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzICYge1xuICAgIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+O1xuICAgIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD47XG4gICAgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+O1xuICAgIGNoZWNrKCk6IFByb21pc2U8dm9pZD47XG4gIH0sXG4gIEJ1dHRvbkZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnMsXG4+IGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYnV0dG9uQ2xhc3M6IEJ1dHRvblR5cGU7XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IGhvc3ROYW1lID0gYXdhaXQgdGhpcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKTtcbiAgICAvLyBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmdcbiAgICAvLyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2UgdGhlIHJhZGlvLWdyb3VwIGRvZXMgbm90IHNldCB0aGUgXCJuYW1lXCIgYXMgYW5cbiAgICAvLyBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGUgXCJuYW1lXCIgdmFsdWUgaXMgc2V0IHRocm91Z2ggYSBiaW5kaW5nLlxuICAgIGlmIChob3N0TmFtZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGhvc3ROYW1lO1xuICAgIH1cbiAgICAvLyBJbiBjYXNlIHdlIGNvdWxkbid0IGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZVxuICAgIC8vIFwibmFtZVwiIGF0dHJpYnV0ZSwgd2UgdHJ5IHRvIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgdGhlIGdyb3VwIGJ5IGdvaW5nXG4gICAgLy8gdGhyb3VnaCBhbGwgcmFkaW8gYnV0dG9ucy5cbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgdGhpcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKCFyYWRpb05hbWVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcignUmFkaW8gYnV0dG9ucyBpbiByYWRpby1ncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLicpO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9OYW1lc1swXSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmcgfCBudWxsPignaWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2VkIHJhZGlvLWJ1dHRvbiBpbiBhIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkUmFkaW9CdXR0b24oKTogUHJvbWlzZTxCdXR0b24gfCBudWxsPiB7XG4gICAgZm9yIChsZXQgcmFkaW9CdXR0b24gb2YgYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoKSkge1xuICAgICAgaWYgKGF3YWl0IHJhZGlvQnV0dG9uLmlzQ2hlY2tlZCgpKSB7XG4gICAgICAgIHJldHVybiByYWRpb0J1dHRvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCB2YWx1ZSBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldENoZWNrZWRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBjaGVja2VkUmFkaW8gPSBhd2FpdCB0aGlzLmdldENoZWNrZWRSYWRpb0J1dHRvbigpO1xuICAgIGlmICghY2hlY2tlZFJhZGlvKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrZWRSYWRpby5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIHJhZGlvIGJ1dHRvbnMgd2hpY2ggYXJlIHBhcnQgb2YgdGhlIHJhZGlvLWdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCByYWRpbyBidXR0b25zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldFJhZGlvQnV0dG9ucyhmaWx0ZXI/OiBCdXR0b25GaWx0ZXJzKTogUHJvbWlzZTxCdXR0b25bXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwodGhpcy5fYnV0dG9uQ2xhc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBhIHJhZGlvIGJ1dHRvbiBpbiB0aGlzIGdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2hpbGQgcmFkaW8gYnV0dG9ucy4gVGhlIGZpcnN0IHRhYiBtYXRjaGluZ1xuICAgKiAgICAgdGhlIGZpbHRlciB3aWxsIGJlIHNlbGVjdGVkLlxuICAgKi9cbiAgYXN5bmMgY2hlY2tSYWRpb0J1dHRvbihmaWx0ZXI/OiBCdXR0b25GaWx0ZXJzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmFkaW9CdXR0b25zID0gYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoZmlsdGVyKTtcbiAgICBpZiAoIXJhZGlvQnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCByYWRpbyBidXR0b24gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9CdXR0b25zWzBdLmNoZWNrKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBhdHRyaWJ1dGUgb2YgdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGxpc3Qgb2YgdGhlIG5hbWUgYXR0cmlidXRlcyBvZiBhbGwgY2hpbGQgcmFkaW8gYnV0dG9ucy4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBncm91cE5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IHJhZGlvIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGNvbnN0IHJhZGlvTmFtZSA9IGF3YWl0IHJhZGlvLmdldE5hbWUoKTtcbiAgICAgIGlmIChyYWRpb05hbWUgIT09IG51bGwpIHtcbiAgICAgICAgZ3JvdXBOYW1lcy5wdXNoKHJhZGlvTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBncm91cE5hbWVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyBpZiB0aGUgc3BlY2lmaWVkIHJhZGlvIG5hbWVzIGFyZSBhbGwgZXF1YWwuICovXG4gIHByaXZhdGUgX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBncm91cE5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IHJhZGlvTmFtZSBvZiByYWRpb05hbWVzKSB7XG4gICAgICBpZiAoZ3JvdXBOYW1lID09PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IHJhZGlvTmFtZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lICE9PSByYWRpb05hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSByYWRpby1ncm91cCBoYXJuZXNzIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gVGhyb3dzIGlmIGEgcmFkaW8tZ3JvdXAgd2l0aFxuICAgKiBtYXRjaGluZyBuYW1lIGNvdWxkIGJlIGZvdW5kIGJ1dCBoYXMgbWlzbWF0Y2hpbmcgcmFkaW8tYnV0dG9uIG5hbWVzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBhc3luYyBfY2hlY2tSYWRpb0dyb3VwTmFtZShcbiAgICBoYXJuZXNzOiBfTWF0UmFkaW9Hcm91cEhhcm5lc3NCYXNlPGFueSwgYW55LCBhbnk+LFxuICAgIG5hbWU6IHN0cmluZyxcbiAgKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSByYWRpby1ncm91cCB3aGljaCBoYXMgdGhlIFwibmFtZVwiIGF0dHJpYnV0ZSBzZXRcbiAgICAvLyB0byB0aGUgZXhwZWN0ZWQgZ3JvdXAgbmFtZS4gSXQncyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZVxuICAgIC8vIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmcgdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyBiZWNhdXNlXG4gICAgLy8gdGhlIHJhZGlvLWdyb3VwIGRvZXMgbm90IHNldCB0aGUgXCJuYW1lXCIgYXMgYW4gZWxlbWVudCBhdHRyaWJ1dGUgaWYgdGhlXG4gICAgLy8gXCJuYW1lXCIgdmFsdWUgaXMgc2V0IHRocm91Z2ggYSBiaW5kaW5nLlxuICAgIGlmICgoYXdhaXQgaGFybmVzcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSkgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIGdyb3VwIHdpdGggcmFkaW8tYnV0dG9ucyB0aGF0IGFsbCBoYXZlIHRoZSBzYW1lXG4gICAgLy8gZXhwZWN0ZWQgbmFtZS4gVGhpcyBpbXBsaWVzIHRoYXQgdGhlIGdyb3VwIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gSXQnc1xuICAgIC8vIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBuYW1lIG9mIGEgcmFkaW8tZ3JvdXAgdGhyb3VnaFxuICAgIC8vIHRoZSBhdHRyaWJ1dGUgYmVjYXVzZSB0aGVyZSBpc1xuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCBoYXJuZXNzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAocmFkaW9OYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWhhcm5lc3MuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIGBUaGUgbG9jYXRvciBmb3VuZCBhIHJhZGlvLWdyb3VwIHdpdGggbmFtZSBcIiR7bmFtZX1cIiwgYnV0IHNvbWUgYCArXG4gICAgICAgICAgYHJhZGlvLWJ1dHRvbidzIHdpdGhpbiB0aGUgZ3JvdXAgaGF2ZSBtaXNtYXRjaGluZyBuYW1lcywgd2hpY2ggaXMgaW52YWxpZC5gLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcmFkaW8tZ3JvdXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cEhhcm5lc3MgZXh0ZW5kcyBfTWF0UmFkaW9Hcm91cEhhcm5lc3NCYXNlPFxuICB0eXBlb2YgTWF0UmFkaW9CdXR0b25IYXJuZXNzLFxuICBNYXRSYWRpb0J1dHRvbkhhcm5lc3MsXG4gIFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnNcbj4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFJhZGlvR3JvdXBgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtcmFkaW8tZ3JvdXAnO1xuICBwcm90ZWN0ZWQgX2J1dHRvbkNsYXNzID0gTWF0UmFkaW9CdXR0b25IYXJuZXNzO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRSYWRpb0dyb3VwSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggcmFkaW8gZ3JvdXAgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogUmFkaW9Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvR3JvdXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBvcHRpb25zKS5hZGRPcHRpb24oXG4gICAgICAnbmFtZScsXG4gICAgICBvcHRpb25zLm5hbWUsXG4gICAgICB0aGlzLl9jaGVja1JhZGlvR3JvdXBOYW1lLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRSYWRpb0J1dHRvbkhhcm5lc3NCYXNlIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdGV4dExhYmVsOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfY2xpY2tMYWJlbDogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQ+O1xuICBwcml2YXRlIF9pbnB1dCA9IHRoaXMubG9jYXRvckZvcignaW5wdXQnKTtcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjaGVja2VkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdjaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCByZXF1aXJlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSByYWRpby1idXR0b24uIFRoZSByYWRpby1idXR0b24gdmFsdWUgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgbWVhbnMgdGhhdCBmb3IgcmFkaW8tYnV0dG9uJ3Mgd2l0aCBhbiBvYmplY3QgYXMgYSB2YWx1ZSBgW29iamVjdCBPYmplY3RdYCBpc1xuICAgKiBpbnRlbnRpb25hbGx5IHJldHVybmVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByYWRpby1idXR0b24ncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RleHRMYWJlbCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcmFkaW8tYnV0dG9uLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbi4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgcmFkaW8tYnV0dG9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSBjbGlja2luZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLFxuICAgKiBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NsaWNrTGFiZWwoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtcmFkaW8tYnV0dG9uIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvQnV0dG9uSGFybmVzcyBleHRlbmRzIF9NYXRSYWRpb0J1dHRvbkhhcm5lc3NCYXNlIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRSYWRpb0J1dHRvbmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1yYWRpby1idXR0b24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRSYWRpb0J1dHRvbkhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHJhZGlvIGJ1dHRvbiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvQnV0dG9uSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0J1dHRvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdsYWJlbCcsIG9wdGlvbnMubGFiZWwsIChoYXJuZXNzLCBsYWJlbCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ2NoZWNrZWQnLFxuICAgICAgICBvcHRpb25zLmNoZWNrZWQsXG4gICAgICAgIGFzeW5jIChoYXJuZXNzLCBjaGVja2VkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0NoZWNrZWQoKSkgPT0gY2hlY2tlZCxcbiAgICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbC1jb250ZW50Jyk7XG4gIHByb3RlY3RlZCBfY2xpY2tMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbCcpO1xufVxuIl19