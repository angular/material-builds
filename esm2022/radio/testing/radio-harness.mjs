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
/** Harness for interacting with an MDC-based mat-radio-group in tests. */
export class MatRadioGroupHarness extends _MatRadioGroupHarnessBase {
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
}
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
/** Harness for interacting with an MDC-based mat-radio-button in tests. */
export class MatRadioButtonHarness extends _MatRadioButtonHarnessBase {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('label');
        this._clickLabel = this._textLabel;
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUdMLGdCQUFnQixFQUVoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5QixNQUFNLE9BQWdCLHlCQVdwQixTQUFRLGdCQUFnQjtJQUd4Qix3Q0FBd0M7SUFDeEMsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3BELCtFQUErRTtRQUMvRSwrRUFBK0U7UUFDL0Usa0VBQWtFO1FBQ2xFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNyQixPQUFPLFFBQVEsQ0FBQztTQUNqQjtRQUNELDJFQUEyRTtRQUMzRSx5RUFBeUU7UUFDekUsNkJBQTZCO1FBQzdCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbEQsTUFBTSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUNyRTtRQUNELE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLEtBQUs7UUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQWdCLElBQUksQ0FBQyxDQUFDO0lB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QyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQzthQUM1RixTQUFTLENBQ1IsU0FBUyxFQUNULE9BQU8sQ0FBQyxPQUFPLEVBQ2YsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQ25FLENBQUM7SUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQXN5bmNGYWN0b3J5Rm4sXG4gIEJhc2VIYXJuZXNzRmlsdGVycyxcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBUZXN0RWxlbWVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzLCBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vcmFkaW8taGFybmVzcy1maWx0ZXJzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRSYWRpb0dyb3VwSGFybmVzc0Jhc2U8XG4gIEJ1dHRvblR5cGUgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8QnV0dG9uPiAmIHtcbiAgICB3aXRoOiAob3B0aW9ucz86IEJ1dHRvbkZpbHRlcnMpID0+IEhhcm5lc3NQcmVkaWNhdGU8QnV0dG9uPjtcbiAgfSxcbiAgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyAmIHtcbiAgICBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPjtcbiAgICBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+O1xuICAgIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPjtcbiAgICBjaGVjaygpOiBQcm9taXNlPHZvaWQ+O1xuICB9LFxuICBCdXR0b25GaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuPiBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2J1dHRvbkNsYXNzOiBCdXR0b25UeXBlO1xuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBob3N0TmFtZSA9IGF3YWl0IHRoaXMuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCk7XG4gICAgLy8gSXQncyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nXG4gICAgLy8gdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyBiZWNhdXNlIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuXG4gICAgLy8gZWxlbWVudCBhdHRyaWJ1dGUgaWYgdGhlIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoaG9zdE5hbWUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBob3N0TmFtZTtcbiAgICB9XG4gICAgLy8gSW4gY2FzZSB3ZSBjb3VsZG4ndCBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGVcbiAgICAvLyBcIm5hbWVcIiBhdHRyaWJ1dGUsIHdlIHRyeSB0byBkZXRlcm1pbmUgdGhlIFwibmFtZVwiIG9mIHRoZSBncm91cCBieSBnb2luZ1xuICAgIC8vIHRocm91Z2ggYWxsIHJhZGlvIGJ1dHRvbnMuXG4gICAgY29uc3QgcmFkaW9OYW1lcyA9IGF3YWl0IHRoaXMuX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpO1xuICAgIGlmICghcmFkaW9OYW1lcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1JhZGlvIGJ1dHRvbnMgaW4gcmFkaW8tZ3JvdXAgaGF2ZSBtaXNtYXRjaGluZyBuYW1lcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvTmFtZXNbMF0hO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHk8c3RyaW5nIHwgbnVsbD4oJ2lkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCByYWRpby1idXR0b24gaW4gYSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk6IFByb21pc2U8QnV0dG9uIHwgbnVsbD4ge1xuICAgIGZvciAobGV0IHJhZGlvQnV0dG9uIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGlmIChhd2FpdCByYWRpb0J1dHRvbi5pc0NoZWNrZWQoKSkge1xuICAgICAgICByZXR1cm4gcmFkaW9CdXR0b247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrZWQgdmFsdWUgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRDaGVja2VkVmFsdWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgY2hlY2tlZFJhZGlvID0gYXdhaXQgdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24oKTtcbiAgICBpZiAoIWNoZWNrZWRSYWRpbykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjaGVja2VkUmFkaW8uZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiByYWRpbyBidXR0b25zIHdoaWNoIGFyZSBwYXJ0IG9mIHRoZSByYWRpby1ncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggcmFkaW8gYnV0dG9ucyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRSYWRpb0J1dHRvbnMoZmlsdGVyPzogQnV0dG9uRmlsdGVycyk6IFByb21pc2U8QnV0dG9uW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKHRoaXMuX2J1dHRvbkNsYXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgYSByYWRpbyBidXR0b24gaW4gdGhpcyBncm91cC5cbiAgICogQHBhcmFtIGZpbHRlciBBbiBvcHRpb25hbCBmaWx0ZXIgdG8gYXBwbHkgdG8gdGhlIGNoaWxkIHJhZGlvIGJ1dHRvbnMuIFRoZSBmaXJzdCB0YWIgbWF0Y2hpbmdcbiAgICogICAgIHRoZSBmaWx0ZXIgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrUmFkaW9CdXR0b24oZmlsdGVyPzogQnV0dG9uRmlsdGVycyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJhZGlvQnV0dG9ucyA9IGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKGZpbHRlcik7XG4gICAgaWYgKCFyYWRpb0J1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgcmFkaW8gYnV0dG9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhZGlvQnV0dG9uc1swXS5jaGVjaygpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgYXR0cmlidXRlIG9mIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBsaXN0IG9mIHRoZSBuYW1lIGF0dHJpYnV0ZXMgb2YgYWxsIGNoaWxkIHJhZGlvIGJ1dHRvbnMuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldE5hbWVzRnJvbVJhZGlvQnV0dG9ucygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgZ3JvdXBOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGxldCByYWRpbyBvZiBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucygpKSB7XG4gICAgICBjb25zdCByYWRpb05hbWUgPSBhd2FpdCByYWRpby5nZXROYW1lKCk7XG4gICAgICBpZiAocmFkaW9OYW1lICE9PSBudWxsKSB7XG4gICAgICAgIGdyb3VwTmFtZXMucHVzaChyYWRpb05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBOYW1lcztcbiAgfVxuXG4gIC8qKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCByYWRpbyBuYW1lcyBhcmUgYWxsIGVxdWFsLiAqL1xuICBwcml2YXRlIF9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBsZXQgZ3JvdXBOYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCByYWRpb05hbWUgb2YgcmFkaW9OYW1lcykge1xuICAgICAgaWYgKGdyb3VwTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWUgPSByYWRpb05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSAhPT0gcmFkaW9OYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcmFkaW8tZ3JvdXAgaGFybmVzcyBoYXMgdGhlIGdpdmVuIG5hbWUuIFRocm93cyBpZiBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogbWF0Y2hpbmcgbmFtZSBjb3VsZCBiZSBmb3VuZCBidXQgaGFzIG1pc21hdGNoaW5nIHJhZGlvLWJ1dHRvbiBuYW1lcy5cbiAgICovXG4gIHByb3RlY3RlZCBzdGF0aWMgYXN5bmMgX2NoZWNrUmFkaW9Hcm91cE5hbWUoXG4gICAgaGFybmVzczogX01hdFJhZGlvR3JvdXBIYXJuZXNzQmFzZTxhbnksIGFueSwgYW55PixcbiAgICBuYW1lOiBzdHJpbmcsXG4gICkge1xuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgcmFkaW8tZ3JvdXAgd2hpY2ggaGFzIHRoZSBcIm5hbWVcIiBhdHRyaWJ1dGUgc2V0XG4gICAgLy8gdG8gdGhlIGV4cGVjdGVkIGdyb3VwIG5hbWUuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIGFsd2F5cyBkZXRlcm1pbmVcbiAgICAvLyB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZSBhdHRyaWJ1dGUuIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRoZSByYWRpby1ncm91cCBkb2VzIG5vdCBzZXQgdGhlIFwibmFtZVwiIGFzIGFuIGVsZW1lbnQgYXR0cmlidXRlIGlmIHRoZVxuICAgIC8vIFwibmFtZVwiIHZhbHVlIGlzIHNldCB0aHJvdWdoIGEgYmluZGluZy5cbiAgICBpZiAoKGF3YWl0IGhhcm5lc3MuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkpID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBncm91cCB3aXRoIHJhZGlvLWJ1dHRvbnMgdGhhdCBhbGwgaGF2ZSB0aGUgc2FtZVxuICAgIC8vIGV4cGVjdGVkIG5hbWUuIFRoaXMgaW1wbGllcyB0aGF0IHRoZSBncm91cCBoYXMgdGhlIGdpdmVuIG5hbWUuIEl0J3NcbiAgICAvLyBub3QgcG9zc2libGUgdG8gYWx3YXlzIGRldGVybWluZSB0aGUgbmFtZSBvZiBhIHJhZGlvLWdyb3VwIHRocm91Z2hcbiAgICAvLyB0aGUgYXR0cmlidXRlIGJlY2F1c2UgdGhlcmUgaXNcbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgaGFybmVzcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKHJhZGlvTmFtZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFoYXJuZXNzLl9jaGVja1JhZGlvTmFtZXNJbkdyb3VwRXF1YWwocmFkaW9OYW1lcykpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBgVGhlIGxvY2F0b3IgZm91bmQgYSByYWRpby1ncm91cCB3aXRoIG5hbWUgXCIke25hbWV9XCIsIGJ1dCBzb21lIGAgK1xuICAgICAgICAgIGByYWRpby1idXR0b24ncyB3aXRoaW4gdGhlIGdyb3VwIGhhdmUgbWlzbWF0Y2hpbmcgbmFtZXMsIHdoaWNoIGlzIGludmFsaWQuYCxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGFuIE1EQy1iYXNlZCBtYXQtcmFkaW8tZ3JvdXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9Hcm91cEhhcm5lc3MgZXh0ZW5kcyBfTWF0UmFkaW9Hcm91cEhhcm5lc3NCYXNlPFxuICB0eXBlb2YgTWF0UmFkaW9CdXR0b25IYXJuZXNzLFxuICBNYXRSYWRpb0J1dHRvbkhhcm5lc3MsXG4gIFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnNcbj4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFJhZGlvR3JvdXBgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWRjLXJhZGlvLWdyb3VwJztcbiAgcHJvdGVjdGVkIF9idXR0b25DbGFzcyA9IE1hdFJhZGlvQnV0dG9uSGFybmVzcztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSByYWRpbyBncm91cCB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCByYWRpbyBncm91cCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aDxUIGV4dGVuZHMgTWF0UmFkaW9Hcm91cEhhcm5lc3M+KFxuICAgIHRoaXM6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgICBvcHRpb25zOiBSYWRpb0dyb3VwSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpLmFkZE9wdGlvbihcbiAgICAgICduYW1lJyxcbiAgICAgIG9wdGlvbnMubmFtZSxcbiAgICAgIE1hdFJhZGlvR3JvdXBIYXJuZXNzLl9jaGVja1JhZGlvR3JvdXBOYW1lLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRSYWRpb0J1dHRvbkhhcm5lc3NCYXNlIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdGV4dExhYmVsOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfY2xpY2tMYWJlbDogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQ+O1xuICBwcml2YXRlIF9pbnB1dCA9IHRoaXMubG9jYXRvckZvcignaW5wdXQnKTtcblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjaGVja2VkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdjaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCByZXF1aXJlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmFkaW8tYnV0dG9uJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJhZGlvLWJ1dHRvbidzIGlkLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSByYWRpby1idXR0b24uIFRoZSByYWRpby1idXR0b24gdmFsdWUgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgbWVhbnMgdGhhdCBmb3IgcmFkaW8tYnV0dG9uJ3Mgd2l0aCBhbiBvYmplY3QgYXMgYSB2YWx1ZSBgW29iamVjdCBPYmplY3RdYCBpc1xuICAgKiBpbnRlbnRpb25hbGx5IHJldHVybmVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByYWRpby1idXR0b24ncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRMYWJlbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RleHRMYWJlbCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcmFkaW8tYnV0dG9uLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHJhZGlvLWJ1dHRvbi4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgcmFkaW8tYnV0dG9uIGluIGEgY2hlY2tlZCBzdGF0ZSBieSBjbGlja2luZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLFxuICAgKiBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NsaWNrTGFiZWwoKSkuY2xpY2soKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYW4gTURDLWJhc2VkIG1hdC1yYWRpby1idXR0b24gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b25IYXJuZXNzIGV4dGVuZHMgX01hdFJhZGlvQnV0dG9uSGFybmVzc0Jhc2Uge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFJhZGlvQnV0dG9uYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1kYy1yYWRpby1idXR0b24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHJhZGlvIGJ1dHRvbiB3aXRoIHNwZWNpZmljXG4gICAqIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCByYWRpbyBidXR0b24gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGg8VCBleHRlbmRzIE1hdFJhZGlvQnV0dG9uSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdsYWJlbCcsIG9wdGlvbnMubGFiZWwsIChoYXJuZXNzLCBsYWJlbCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ2NoZWNrZWQnLFxuICAgICAgICBvcHRpb25zLmNoZWNrZWQsXG4gICAgICAgIGFzeW5jIChoYXJuZXNzLCBjaGVja2VkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0NoZWNrZWQoKSkgPT0gY2hlY2tlZCxcbiAgICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignbGFiZWwnKTtcbiAgcHJvdGVjdGVkIF9jbGlja0xhYmVsID0gdGhpcy5fdGV4dExhYmVsO1xufVxuIl19