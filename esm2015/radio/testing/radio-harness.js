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
let MatRadioGroupHarness = /** @class */ (() => {
    class MatRadioGroupHarness extends ComponentHarness {
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
    MatRadioGroupHarness.hostSelector = 'mat-radio-group';
    return MatRadioGroupHarness;
})();
export { MatRadioGroupHarness };
/** Harness for interacting with a standard mat-radio-button in tests. */
let MatRadioButtonHarness = /** @class */ (() => {
    class MatRadioButtonHarness extends ComponentHarness {
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
    MatRadioButtonHarness.hostSelector = 'mat-radio-button';
    return MatRadioButtonHarness;
})();
export { MatRadioButtonHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8taGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9yYWRpby90ZXN0aW5nL3JhZGlvLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHdFQUF3RTtBQUN4RTtJQUFBLE1BQWEsb0JBQXFCLFNBQVEsZ0JBQWdCO1FBSXhEOzs7OztXQUtHO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFvQyxFQUFFO1lBQ2hELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7aUJBQ3JELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRUQsd0NBQXdDO1FBQ2xDLE9BQU87O2dCQUNYLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQ3BELCtFQUErRTtnQkFDL0UsK0VBQStFO2dCQUMvRSxrRUFBa0U7Z0JBQ2xFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtvQkFDckIsT0FBTyxRQUFRLENBQUM7aUJBQ2pCO2dCQUNELDJFQUEyRTtnQkFDM0UseUVBQXlFO2dCQUN6RSw2QkFBNkI7Z0JBQzdCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7Z0JBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUN0QixPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsQ0FBQyxFQUFF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LCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycywgUmFkaW9Hcm91cEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3JhZGlvLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXJhZGlvLWdyb3VwIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFJhZGlvR3JvdXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0UmFkaW9Hcm91cGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXJhZGlvLWdyb3VwJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0UmFkaW9Hcm91cEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHJhZGlvIGdyb3VwIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFJhZGlvR3JvdXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRSYWRpb0dyb3VwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0dyb3VwSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbmFtZScsIG9wdGlvbnMubmFtZSwgdGhpcy5fY2hlY2tSYWRpb0dyb3VwTmFtZSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgcmFkaW8tZ3JvdXAuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGhvc3ROYW1lID0gYXdhaXQgdGhpcy5fZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKTtcbiAgICAvLyBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBcIm5hbWVcIiBvZiBhIHJhZGlvLWdyb3VwIGJ5IHJlYWRpbmdcbiAgICAvLyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2UgdGhlIHJhZGlvLWdyb3VwIGRvZXMgbm90IHNldCB0aGUgXCJuYW1lXCIgYXMgYW5cbiAgICAvLyBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGUgXCJuYW1lXCIgdmFsdWUgaXMgc2V0IHRocm91Z2ggYSBiaW5kaW5nLlxuICAgIGlmIChob3N0TmFtZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGhvc3ROYW1lO1xuICAgIH1cbiAgICAvLyBJbiBjYXNlIHdlIGNvdWxkbid0IGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgYSByYWRpby1ncm91cCBieSByZWFkaW5nIHRoZVxuICAgIC8vIFwibmFtZVwiIGF0dHJpYnV0ZSwgd2UgdHJ5IHRvIGRldGVybWluZSB0aGUgXCJuYW1lXCIgb2YgdGhlIGdyb3VwIGJ5IGdvaW5nXG4gICAgLy8gdGhyb3VnaCBhbGwgcmFkaW8gYnV0dG9ucy5cbiAgICBjb25zdCByYWRpb05hbWVzID0gYXdhaXQgdGhpcy5fZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk7XG4gICAgaWYgKCFyYWRpb05hbWVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghdGhpcy5fY2hlY2tSYWRpb05hbWVzSW5Hcm91cEVxdWFsKHJhZGlvTmFtZXMpKSB7XG4gICAgICB0aHJvdyBFcnJvcignUmFkaW8gYnV0dG9ucyBpbiByYWRpby1ncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLicpO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9OYW1lc1swXSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIHJhZGlvLWdyb3VwLiAqL1xuICBhc3luYyBnZXRJZCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2lkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tlZCByYWRpby1idXR0b24gaW4gYSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uKCk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzfG51bGw+IHtcbiAgICBmb3IgKGxldCByYWRpb0J1dHRvbiBvZiBhd2FpdCB0aGlzLmdldFJhZGlvQnV0dG9ucygpKSB7XG4gICAgICBpZiAoYXdhaXQgcmFkaW9CdXR0b24uaXNDaGVja2VkKCkpIHtcbiAgICAgICAgcmV0dXJuIHJhZGlvQnV0dG9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2VkIHZhbHVlIG9mIHRoZSByYWRpby1ncm91cC4gKi9cbiAgYXN5bmMgZ2V0Q2hlY2tlZFZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBjaGVja2VkUmFkaW8gPSBhd2FpdCB0aGlzLmdldENoZWNrZWRSYWRpb0J1dHRvbigpO1xuICAgIGlmICghY2hlY2tlZFJhZGlvKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrZWRSYWRpby5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIHJhZGlvIGJ1dHRvbnMgd2hpY2ggYXJlIHBhcnQgb2YgdGhlIHJhZGlvLWdyb3VwLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCByYWRpbyBidXR0b25zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldFJhZGlvQnV0dG9ucyhmaWx0ZXI6IFJhZGlvQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0UmFkaW9CdXR0b25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFJhZGlvQnV0dG9uSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGEgcmFkaW8gYnV0dG9uIGluIHRoaXMgZ3JvdXAuXG4gICAqIEBwYXJhbSBmaWx0ZXIgQW4gb3B0aW9uYWwgZmlsdGVyIHRvIGFwcGx5IHRvIHRoZSBjaGlsZCByYWRpbyBidXR0b25zLiBUaGUgZmlyc3QgdGFiIG1hdGNoaW5nXG4gICAqICAgICB0aGUgZmlsdGVyIHdpbGwgYmUgc2VsZWN0ZWQuXG4gICAqL1xuICBhc3luYyBjaGVja1JhZGlvQnV0dG9uKGZpbHRlcjogUmFkaW9CdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmFkaW9CdXR0b25zID0gYXdhaXQgdGhpcy5nZXRSYWRpb0J1dHRvbnMoZmlsdGVyKTtcbiAgICBpZiAoIXJhZGlvQnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCByYWRpbyBidXR0b24gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXIpfWApO1xuICAgIH1cbiAgICByZXR1cm4gcmFkaW9CdXR0b25zWzBdLmNoZWNrKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBhdHRyaWJ1dGUgb2YgdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0R3JvdXBOYW1lRnJvbUhvc3QoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGxpc3Qgb2YgdGhlIG5hbWUgYXR0cmlidXRlcyBvZiBhbGwgY2hpbGQgcmFkaW8gYnV0dG9ucy4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0TmFtZXNGcm9tUmFkaW9CdXR0b25zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBncm91cE5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IHJhZGlvIG9mIGF3YWl0IHRoaXMuZ2V0UmFkaW9CdXR0b25zKCkpIHtcbiAgICAgIGNvbnN0IHJhZGlvTmFtZSA9IGF3YWl0IHJhZGlvLmdldE5hbWUoKTtcbiAgICAgIGlmIChyYWRpb05hbWUgIT09IG51bGwpIHtcbiAgICAgICAgZ3JvdXBOYW1lcy5wdXNoKHJhZGlvTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBncm91cE5hbWVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyBpZiB0aGUgc3BlY2lmaWVkIHJhZGlvIG5hbWVzIGFyZSBhbGwgZXF1YWwuICovXG4gIHByaXZhdGUgX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBncm91cE5hbWU6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCByYWRpb05hbWUgb2YgcmFkaW9OYW1lcykge1xuICAgICAgaWYgKGdyb3VwTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBncm91cE5hbWUgPSByYWRpb05hbWU7XG4gICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSAhPT0gcmFkaW9OYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgcmFkaW8tZ3JvdXAgaGFybmVzcyBoYXMgdGhlIGdpdmVuIG5hbWUuIFRocm93cyBpZiBhIHJhZGlvLWdyb3VwIHdpdGhcbiAgICogbWF0Y2hpbmcgbmFtZSBjb3VsZCBiZSBmb3VuZCBidXQgaGFzIG1pc21hdGNoaW5nIHJhZGlvLWJ1dHRvbiBuYW1lcy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGFzeW5jIF9jaGVja1JhZGlvR3JvdXBOYW1lKGhhcm5lc3M6IE1hdFJhZGlvR3JvdXBIYXJuZXNzLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHJhZGlvLWdyb3VwIHdoaWNoIGhhcyB0aGUgXCJuYW1lXCIgYXR0cmlidXRlIHNldFxuICAgIC8vIHRvIHRoZSBleHBlY3RlZCBncm91cCBuYW1lLiBJdCdzIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lXG4gICAgLy8gdGhlIFwibmFtZVwiIG9mIGEgcmFkaW8tZ3JvdXAgYnkgcmVhZGluZyB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAvLyB0aGUgcmFkaW8tZ3JvdXAgZG9lcyBub3Qgc2V0IHRoZSBcIm5hbWVcIiBhcyBhbiBlbGVtZW50IGF0dHJpYnV0ZSBpZiB0aGVcbiAgICAvLyBcIm5hbWVcIiB2YWx1ZSBpcyBzZXQgdGhyb3VnaCBhIGJpbmRpbmcuXG4gICAgaWYgKGF3YWl0IGhhcm5lc3MuX2dldEdyb3VwTmFtZUZyb21Ib3N0KCkgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIGdyb3VwIHdpdGggcmFkaW8tYnV0dG9ucyB0aGF0IGFsbCBoYXZlIHRoZSBzYW1lXG4gICAgLy8gZXhwZWN0ZWQgbmFtZS4gVGhpcyBpbXBsaWVzIHRoYXQgdGhlIGdyb3VwIGhhcyB0aGUgZ2l2ZW4gbmFtZS4gSXQnc1xuICAgIC8vIG5vdCBwb3NzaWJsZSB0byBhbHdheXMgZGV0ZXJtaW5lIHRoZSBuYW1lIG9mIGEgcmFkaW8tZ3JvdXAgdGhyb3VnaFxuICAgIC8vIHRoZSBhdHRyaWJ1dGUgYmVjYXVzZSB0aGVyZSBpc1xuICAgIGNvbnN0IHJhZGlvTmFtZXMgPSBhd2FpdCBoYXJuZXNzLl9nZXROYW1lc0Zyb21SYWRpb0J1dHRvbnMoKTtcbiAgICBpZiAocmFkaW9OYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWhhcm5lc3MuX2NoZWNrUmFkaW9OYW1lc0luR3JvdXBFcXVhbChyYWRpb05hbWVzKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYFRoZSBsb2NhdG9yIGZvdW5kIGEgcmFkaW8tZ3JvdXAgd2l0aCBuYW1lIFwiJHtuYW1lfVwiLCBidXQgc29tZSBgICtcbiAgICAgICAgICBgcmFkaW8tYnV0dG9uJ3Mgd2l0aGluIHRoZSBncm91cCBoYXZlIG1pc21hdGNoaW5nIG5hbWVzLCB3aGljaCBpcyBpbnZhbGlkLmApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1yYWRpby1idXR0b24gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0UmFkaW9CdXR0b25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0UmFkaW9CdXR0b25gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1yYWRpby1idXR0b24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRSYWRpb0J1dHRvbkhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHJhZGlvIGJ1dHRvbiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBSYWRpb0J1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFJhZGlvQnV0dG9uSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRSYWRpb0J1dHRvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgICAnbGFiZWwnLCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgKGhhcm5lc3MsIGxhYmVsKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ25hbWUnLCBvcHRpb25zLm5hbWUsIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RleHRMYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1yYWRpby1sYWJlbC1jb250ZW50Jyk7XG4gIHByaXZhdGUgX2NsaWNrTGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtcmFkaW8tbGFiZWwnKTtcbiAgcHJpdmF0ZSBfaW5wdXQgPSB0aGlzLmxvY2F0b3JGb3IoJ2lucHV0Jyk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgnY2hlY2tlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgY2hlY2tlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcmFkaW8tYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSByYWRpby1idXR0b24gaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgcmVxdWlyZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJhZGlvLWJ1dHRvbidzIG5hbWUuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmFkaW8tYnV0dG9uJ3MgaWQuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgcmFkaW8tYnV0dG9uLiBUaGUgcmFkaW8tYnV0dG9uIHZhbHVlIHdpbGwgYmUgY29udmVydGVkIHRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIG1lYW5zIHRoYXQgZm9yIHJhZGlvLWJ1dHRvbidzIHdpdGggYW4gb2JqZWN0IGFzIGEgdmFsdWUgYFtvYmplY3QgT2JqZWN0XWAgaXNcbiAgICogaW50ZW50aW9uYWxseSByZXR1cm5lZC5cbiAgICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5KCd2YWx1ZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJhZGlvLWJ1dHRvbidzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdGV4dExhYmVsKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSByYWRpby1idXR0b24uICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgcmFkaW8tYnV0dG9uLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJhZGlvLWJ1dHRvbiBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSByYWRpby1idXR0b24gaW4gYSBjaGVja2VkIHN0YXRlIGJ5IGNsaWNraW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSB1bmNoZWNrZWQsXG4gICAqIG9yIGRvaW5nIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY2xpY2tMYWJlbCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxufVxuIl19