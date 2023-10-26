/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Harness for interacting with an MDC-based mat-radio-group in tests. */
export class MatRadioGroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._buttonClass = MatRadioButtonHarness;
    }
    /** The selector for the host element of a `MatRadioGroup` instance. */
    static { this.hostSelector = '.mat-mdc-radio-group'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio group with specific
     * attributes.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('name', options.name, MatRadioGroupHarness._checkRadioGroupName);
    }
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
/** Harness for interacting with an MDC-based mat-radio-button in tests. */
export class MatRadioButtonHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('label');
        this._clickLabel = this._textLabel;
        this._input = this.locatorFor('input');
    }
    /** The selector for the host element of a `MatRadioButton` instance. */
    static { this.hostSelector = '.mat-mdc-radio-button'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio button with specific
     * attributes.
     * @param options Options for filtering which radio button instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUNMLGdCQUFnQixFQUVoQixnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5QiwwRUFBMEU7QUFDMUUsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGdCQUFnQjtJQUExRDs7UUFJVSxpQkFBWSxHQUFHLHFCQUFxQixDQUFDO0lBaUovQyxDQUFDO0lBcEpDLHVFQUF1RTthQUNoRSxpQkFBWSxHQUFHLHNCQUFzQixBQUF6QixDQUEwQjtJQUk3Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBb0MsRUFBRTtRQUV0QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDbEQsTUFBTSxFQUNOLE9BQU8sQ0FBQyxJQUFJLEVBQ1osb0JBQW9CLENBQUMsb0JBQW9CLENBQzFDLENBQUM7SUFDSixDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNwRCwrRUFBK0U7UUFDL0UsK0VBQStFO1FBQy9FLGtFQUFrRTtRQUNsRSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDckIsT0FBTyxRQUFRLENBQUM7U0FDakI7UUFDRCwyRUFBMkU7UUFDM0UseUVBQXlFO1FBQ3pFLDZCQUE2QjtRQUM3QixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxVQUFVLENB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QVMsRUFBRSxDQUFDLEVBQUU7WUFDN0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDM0M7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1JhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMsIFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9yYWRpby1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhbiBNREMtYmFzZWQgbWF0LXJhZGlvLWdyb3VwIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0UmFkaW9Hcm91cGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtcmFkaW8tZ3JvdXAnO1xuXG4gIHByaXZhdGUgX2J1dHRvbkNsYXNzID0gTWF0UmFkaW9CdXR0b25IYXJuZXNzO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHJhZGlvIGdyb3VwIHdpdGggc3BlY2lmaWNcbiAgICogYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHJhZGlvIGdyb3VwIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRSYWRpb0dyb3VwSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodGhpcywgb3B0aW9ucykuYWRkT3B0aW9uKFxuICAgICAgJ25hbWUnLFxuICAgICAgb3B0aW9ucy5uYW1lLFxuICAgICAgTWF0UmFkaW9Hcm91cEhhcm5lc3MuX2NoZWNrUmFkaW9Hcm91cE5hbWUsXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBob3N0TmFtZSA9IGF3YWl0IHRoaXMuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCk7XG4gICAgLy8gSXQncyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nXG4gICAgLy8gdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyBiZWNhdXNlIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuXG4gICAgLy8gZWxlbWVudCBhdHRyaWJ1dGUgaWYgdGhlIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoaG9zdE5hbWUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBob3N0TmFtZTtcbiAgICB9XG4gICAgLy8gSW4gY2FzZSB3ZSBjb3VsZG4ndCBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGVcbiAgICAvLyBcIm5hbWVcIiBhdHRyaWJ1dGUsIHdlIHRyeSB0byBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIHRoZSBncm91cCBieSBnb2luZ1xuICAgIC8vIHRocm91Z2ggYWxsIHJhZGlvIGJ1dHRvbnMuXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IHRoaXMuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmICghcmFkaW9OYW1lcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1JhZGlvIGJ1dHRvbnMgaW4gcmFkaW8tZ3JvdXAgaGF2ZSBtaXNtYXRjaGluZyBuYW1lcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvTmFtZXNbMF0hO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHk8c3RyaW5nIHwgbnVsbD4oJ2lkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCByYWRpby1idXR0b24gaW4gYSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzIHwgbnVsbD4ge1xuICAgIGZvciAobGV0IHJhZGlvQnV0dG9uIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGlmIChhd2FpdCByYWRpb0J1dHRvbi5pc0NoZWNrZWQoKSkge1xuICAgICAgICByZXR1cm4gcmFkaW9CdXR0b247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgdmFsdWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkVmFsdWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgY2hlY2tlZFJhZGlvID0gYXdhaXQgdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24oKTtcbiAgICBpZiAoIWNoZWNrZWRSYWRpbykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjaGVja2VkUmFkaW8uZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiByYWRpbyBidXR0b25zIHdoaWNoIGFyZSBwYXJ0IG9mIHRoZSByYWRpby1ncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggcmFkaW8gYnV0dG9ucyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRSYWRpb0J1dHRvbnMoZmlsdGVyPzogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKHRoaXMuX2J1dHRvbkNsYXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgYSByYWRpbyBidXR0b24gaW4gdGhpcyBncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBBbiBvcHRpb25hbCBmaWx0ZXIgdG8gYXBwbHkgdG8gdGhlIGNoaWxkIHJhZGlvIGJ1dHRvbnMuIFRoZSBmaXJzdCB0YWIgbWF0Y2hpbmdcbiAgICogICAgIHRoZSBmaWx0ZXIgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrUmFkaW9CdXR0b24oZmlsdGVyPzogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJhZGlvQnV0dG9ucyA9IGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKGZpbHRlcik7XG4gICAgaWYgKCFyYWRpb0J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgcmFkaW8gYnV0dG9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvQnV0dG9uc1swXS5jaGVjaygpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgYXR0cmlidXRlIG9mIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBsaXN0IG9mIHRoZSBuYW1lIGF0dHJpYnV0ZXMgb2YgYWxsIGNoaWxkIHJhZGlvIGJ1dHRvbnMuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgZ3JvdXBOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGxldCByYWRpbyBvZiBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucygpKSB7XG4gICAgICBjb25zdCByYWRpb05hbWUgPSBhd2FpdCByYWRpby5nZXROYW1lKCk7XG4gICAgICBpZiAocmFkaW9OYW1lICE9PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZXMucHVzaChyYWRpb05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBOYW1lcztcbiAgfVxuXG4gIC8qKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCByYWRpbyBuYW1lcyBhcmUgYWxsIGVxdWFsLiAqL1xuICBwcml2YXRlIF9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBsZXQgZ3JvdXBOYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCByYWRpb05hbWUgb2YgcmFkaW9OYW1lcykge1xuICAgICAgaWYgKGdyb3VwTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWUgPSByYWRpb05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSAhPT0gcmFkaW9OYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcmFkaW8tZ3JvdXAgaGFybmVzcyBoYXMgdGhlIGdpdmVuIG5hbWUuIFRocm93cyBpZiBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogbWF0Y2hpbmcgbmFtZSBjb3VsZCBiZSBmb3VuZCBidXQgaGFzIG1pc21hdGNoaW5nIHJhZGlvLWJ1dHRvbiBuYW1lcy5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgYXN5bmMgX2NoZWNrUmFkaW9Hcm91cE5hbWUoaGFybmVzczogTWF0UmFkaW9Hcm91cEhhcm5lc3MsIG5hbWU6IHN0cmluZykge1xuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgcmFkaW8tZ3JvdXAgd2hpY2ggaGFzIHRoZSBcIm5hbWVcIiBhdHRyaWJ1dGUgc2V0XG4gICAgLy8gdG8gdGhlIGV4cGVjdGVkIGdyb3VwIG5hbWUuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmVcbiAgICAvLyB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZVxuICAgIC8vIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoKGF3YWl0IGhhcm5lc3MuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkpID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBncm91cCB3aXRoIHJhZGlvLWJ1dHRvbnMgdGhhdCBhbGwgaGF2ZSB0aGUgc2FtZVxuICAgIC8vIGV4cGVjdGVkIG5hbWUuIFRoaXMgaW1wbGllcyB0aGF0IHRoZSBncm91cCBoYXMgdGhlIGdpdmVuIG5hbWUuIEl0J3NcbiAgICAvLyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgbmFtZSBvZiBhIHJhZGlvLWdyb3VwIHRocm91Z2hcbiAgICAvLyB0aGUgYXR0cmlidXRlIGJlY2F1c2UgdGhlcmUgaXNcbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgaGFybmVzcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKHJhZGlvTmFtZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFoYXJuZXNzLl9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lcykpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBgVGhlIGxvY2F0b3IgZm91bmQgYSByYWRpby1ncm91cCB3aXRoIG5hbWUgXCIke25hbWV9XCIsIGJ1dCBzb21lIGAgK1xuICAgICAgICAgIGByYWRpby1idXR0b24ncyB3aXRoaW4gdGhlIGdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMsIHdoaWNoIGlzIGludmFsaWQuYCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGFuIE1EQy1iYXNlZCBtYXQtcmFkaW8tYnV0dG9uIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvQnV0dG9uSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFJhZGlvQnV0dG9uYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1kYy1yYWRpby1idXR0b24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHJhZGlvIGJ1dHRvbiB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCByYWRpbyBidXR0b24gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGg8VCBleHRlbmRzIE1hdFJhZGlvQnV0dG9uSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdsYWJlbCcsIG9wdGlvbnMubGFiZWwsIChoYXJuZXNzLCBsYWJlbCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ2NoZWNrZWQnLFxuICAgICAgICBvcHRpb25zLmNoZWNrZWQsXG4gICAgICAgIGFzeW5jIChoYXJuZXNzLCBjaGVja2VkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0NoZWNrZWQoKSkgPT0gY2hlY2tlZCxcbiAgICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignbGFiZWwnKTtcbiAgcHJvdGVjdGVkIF9jbGlja0xhYmVsID0gdGhpcy5fdGV4dExhYmVsO1xuICBwcml2YXRlIF9pbnB1dCA9IHRoaXMubG9jYXRvckZvcignaW5wdXQnKTtcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjaGVja2VkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdjaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCByZXF1aXJlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSByYWRpby1idXR0b24uIFRoZSByYWRpby1idXR0b24gdmFsdWUgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgbWVhbnMgdGhhdCBmb3IgcmFkaW8tYnV0dG9uJ3Mgd2l0aCBhbiBvYmplY3QgYXMgYSB2YWx1ZSBgW29iamVjdCBPYmplY3RdYCBpc1xuICAgKiBpbnRlbnRpb25hbGx5IHJldHVybmVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByYWRpby1idXR0b24ncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RleHRMYWJlbCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcmFkaW8tYnV0dG9uLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbi4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgcmFkaW8tYnV0dG9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSBjbGlja2luZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLFxuICAgKiBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NsaWNrTGFiZWwoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==