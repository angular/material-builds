/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
export class _MatCheckboxHarnessBase extends ComponentHarness {
    /** Whether the checkbox is checked. */
    async isChecked() {
        const checked = (await this._input()).getProperty('checked');
        return coerceBooleanProperty(await checked);
    }
    /** Whether the checkbox is in an indeterminate state. */
    async isIndeterminate() {
        const indeterminate = (await this._input()).getProperty('indeterminate');
        return coerceBooleanProperty(await indeterminate);
    }
    /** Whether the checkbox is disabled. */
    async isDisabled() {
        const disabled = (await this._input()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the checkbox is required. */
    async isRequired() {
        const required = (await this._input()).getProperty('required');
        return coerceBooleanProperty(await required);
    }
    /** Whether the checkbox is valid. */
    async isValid() {
        const invalid = (await this.host()).hasClass('ng-invalid');
        return !(await invalid);
    }
    /** Gets the checkbox's name. */
    async getName() {
        return (await this._input()).getAttribute('name');
    }
    /** Gets the checkbox's value. */
    async getValue() {
        return (await this._input()).getProperty('value');
    }
    /** Gets the checkbox's aria-label. */
    async getAriaLabel() {
        return (await this._input()).getAttribute('aria-label');
    }
    /** Gets the checkbox's aria-labelledby. */
    async getAriaLabelledby() {
        return (await this._input()).getAttribute('aria-labelledby');
    }
    /** Gets the checkbox's label text. */
    async getLabelText() {
        return (await this._label()).text();
    }
    /** Focuses the checkbox. */
    async focus() {
        return (await this._input()).focus();
    }
    /** Blurs the checkbox. */
    async blur() {
        return (await this._input()).blur();
    }
    /** Whether the checkbox is focused. */
    async isFocused() {
        return (await this._input()).isFocused();
    }
    /**
     * Puts the checkbox in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     *
     * Note: This attempts to check the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_DEFAULT_OPTIONS` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    async check() {
        if (!(await this.isChecked())) {
            await this.toggle();
        }
    }
    /**
     * Puts the checkbox in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     *
     * Note: This attempts to uncheck the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_DEFAULT_OPTIONS` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    async uncheck() {
        if (await this.isChecked()) {
            await this.toggle();
        }
    }
}
/** Harness for interacting with a standard mat-checkbox in tests. */
export class MatCheckboxHarness extends _MatCheckboxHarnessBase {
    constructor() {
        super(...arguments);
        this._input = this.locatorFor('input');
        this._label = this.locatorFor('.mat-checkbox-label');
        this._inputContainer = this.locatorFor('.mat-checkbox-inner-container');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCheckboxHarness` that meets
     * certain criteria.
     * @param options Options for filtering which checkbox instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return (new HarnessPredicate(MatCheckboxHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the checkbox is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked));
    }
    async toggle() {
        return (await this._inputContainer()).click();
    }
}
/** The selector for the host element of a `MatCheckbox` instance. */
MatCheckboxHarness.hostSelector = '.mat-checkbox';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGVja2JveC90ZXN0aW5nL2NoZWNrYm94LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5QixNQUFNLE9BQWdCLHVCQUF3QixTQUFRLGdCQUFnQjtJQUlwRSx1Q0FBdUM7SUFDdkMsS0FBSyxDQUFDLFNBQVM7UUFDYixNQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFVLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8scUJBQXFCLENBQUMsTUFBTSxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQseURBQXlEO0lBQ3pELEtBQUssQ0FBQyxlQUFlO1FBQ25CLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVMsZUFBZSxDQUFDLENBQUM7UUFDakYsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8scUJBQXFCLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBVSxVQUFVLENBQUMsQ0FBQztRQUN4RSxPQUFPLHFCQUFxQixDQUFDLE1BQU0sUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQWdCLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsS0FBSyxDQUFDLGlCQUFpQjtRQUNyQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFRCw0QkFBNEI7SUFDNUIsS0FBSyxDQUFDLEtBQUs7UUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLEtBQUssQ0FBQyxJQUFJO1FBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxLQUFLLENBQUMsU0FBUztRQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFXRDs7Ozs7OztPQU9HO0lBQ0gsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsT0FBTztRQUNYLElBQUksTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxxRUFBcUU7QUFDckUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLHVCQUF1QjtJQUEvRDs7UUFnQ1ksV0FBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsV0FBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNsRCxvQkFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUMsQ0FBQztJQUs3RSxDQUFDO0lBbkNDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sQ0FDTCxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQzthQUM5QyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FDcEQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FDOUQ7WUFDRCxvRkFBb0Y7WUFDcEYscUZBQXFGO1lBQ3JGLG1GQUFtRjthQUNsRixTQUFTLENBQ1IsTUFBTSxFQUNOLE9BQU8sQ0FBQyxJQUFJLEVBQ1osS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQzVEO2FBQ0EsU0FBUyxDQUNSLFNBQVMsRUFDVCxPQUFPLENBQUMsT0FBTyxFQUNmLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUNuRSxDQUNKLENBQUM7SUFDSixDQUFDO0lBTUQsS0FBSyxDQUFDLE1BQU07UUFDVixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoRCxDQUFDOztBQXJDRCxxRUFBcUU7QUFDOUQsK0JBQVksR0FBRyxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Q2hlY2tib3hIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9jaGVja2JveC1oYXJuZXNzLWZpbHRlcnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdENoZWNrYm94SGFybmVzc0Jhc2UgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9pbnB1dDogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2xhYmVsOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudD47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjaGVja2VkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5PGJvb2xlYW4+KCdjaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBpbiBhbiBpbmRldGVybWluYXRlIHN0YXRlLiAqL1xuICBhc3luYyBpc0luZGV0ZXJtaW5hdGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaW5kZXRlcm1pbmF0ZSA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdpbmRldGVybWluYXRlJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBpbmRldGVybWluYXRlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0UHJvcGVydHk8Ym9vbGVhbj4oJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCByZXF1aXJlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgdmFsaWQuICovXG4gIGFzeW5jIGlzVmFsaWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaW52YWxpZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLWludmFsaWQnKTtcbiAgICByZXR1cm4gIShhd2FpdCBpbnZhbGlkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIG5hbWUuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIHZhbHVlLiAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldFByb3BlcnR5PHN0cmluZyB8IG51bGw+KCd2YWx1ZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrYm94J3MgYXJpYS1sYWJlbC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2hlY2tib3gncyBhcmlhLWxhYmVsbGVkYnkuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGNoZWNrYm94LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGNoZWNrYm94LiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIGNoZWNrYm94LlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGF0dGVtcHRzIHRvIHRvZ2dsZSB0aGUgY2hlY2tib3ggYXMgYSB1c2VyIHdvdWxkLCBieSBjbGlja2luZyBpdC4gVGhlcmVmb3JlIGlmIHlvdVxuICAgKiBhcmUgdXNpbmcgYE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlNgIHRvIGNoYW5nZSB0aGUgYmVoYXZpb3Igb24gY2xpY2ssIGNhbGxpbmcgdGhpcyBtZXRob2RcbiAgICogbWlnaHQgbm90IGhhdmUgdGhlIGV4cGVjdGVkIHJlc3VsdC5cbiAgICovXG4gIGFic3RyYWN0IHRvZ2dsZSgpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBjaGVja2JveCBpbiBhIGNoZWNrZWQgc3RhdGUgYnkgdG9nZ2xpbmcgaXQgaWYgaXQgaXMgY3VycmVudGx5IHVuY2hlY2tlZCwgb3IgZG9pbmdcbiAgICogbm90aGluZyBpZiBpdCBpcyBhbHJlYWR5IGNoZWNrZWQuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgYXR0ZW1wdHMgdG8gY2hlY2sgdGhlIGNoZWNrYm94IGFzIGEgdXNlciB3b3VsZCwgYnkgY2xpY2tpbmcgaXQuIFRoZXJlZm9yZSBpZiB5b3VcbiAgICogYXJlIHVzaW5nIGBNQVRfQ0hFQ0tCT1hfREVGQVVMVF9PUFRJT05TYCB0byBjaGFuZ2UgdGhlIGJlaGF2aW9yIG9uIGNsaWNrLCBjYWxsaW5nIHRoaXMgbWV0aG9kXG4gICAqIG1pZ2h0IG5vdCBoYXZlIHRoZSBleHBlY3RlZCByZXN1bHQuXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLmlzQ2hlY2tlZCgpKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgY2hlY2tib3ggaW4gYW4gdW5jaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSBjaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgdW5jaGVja2VkLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGF0dGVtcHRzIHRvIHVuY2hlY2sgdGhlIGNoZWNrYm94IGFzIGEgdXNlciB3b3VsZCwgYnkgY2xpY2tpbmcgaXQuIFRoZXJlZm9yZSBpZiB5b3VcbiAgICogYXJlIHVzaW5nIGBNQVRfQ0hFQ0tCT1hfREVGQVVMVF9PUFRJT05TYCB0byBjaGFuZ2UgdGhlIGJlaGF2aW9yIG9uIGNsaWNrLCBjYWxsaW5nIHRoaXMgbWV0aG9kXG4gICAqIG1pZ2h0IG5vdCBoYXZlIHRoZSBleHBlY3RlZCByZXN1bHQuXG4gICAqL1xuICBhc3luYyB1bmNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzQ2hlY2tlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1jaGVja2JveCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveEhhcm5lc3MgZXh0ZW5kcyBfTWF0Q2hlY2tib3hIYXJuZXNzQmFzZSB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Q2hlY2tib3hgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtY2hlY2tib3gnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRDaGVja2JveEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNoZWNrYm94IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENoZWNrYm94SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Q2hlY2tib3hIYXJuZXNzPiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdENoZWNrYm94SGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignbGFiZWwnLCBvcHRpb25zLmxhYmVsLCAoaGFybmVzcywgbGFiZWwpID0+XG4gICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSxcbiAgICAgICAgKVxuICAgICAgICAvLyBXZSB3YW50IHRvIHByb3ZpZGUgYSBmaWx0ZXIgb3B0aW9uIGZvciBcIm5hbWVcIiBiZWNhdXNlIHRoZSBuYW1lIG9mIHRoZSBjaGVja2JveCBpc1xuICAgICAgICAvLyBvbmx5IHNldCBvbiB0aGUgdW5kZXJseWluZyBpbnB1dC4gVGhpcyBtZWFucyB0aGF0IGl0J3Mgbm90IHBvc3NpYmxlIGZvciBkZXZlbG9wZXJzXG4gICAgICAgIC8vIHRvIHJldHJpZXZlIHRoZSBoYXJuZXNzIG9mIGEgc3BlY2lmaWMgY2hlY2tib3ggd2l0aCBuYW1lIHRocm91Z2ggYSBDU1Mgc2VsZWN0b3IuXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgJ25hbWUnLFxuICAgICAgICAgIG9wdGlvbnMubmFtZSxcbiAgICAgICAgICBhc3luYyAoaGFybmVzcywgbmFtZSkgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0TmFtZSgpKSA9PT0gbmFtZSxcbiAgICAgICAgKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICdjaGVja2VkJyxcbiAgICAgICAgICBvcHRpb25zLmNoZWNrZWQsXG4gICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGNoZWNrZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzQ2hlY2tlZCgpKSA9PSBjaGVja2VkLFxuICAgICAgICApXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfaW5wdXQgPSB0aGlzLmxvY2F0b3JGb3IoJ2lucHV0Jyk7XG4gIHByb3RlY3RlZCBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtY2hlY2tib3gtbGFiZWwnKTtcbiAgcHJpdmF0ZSBfaW5wdXRDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtY2hlY2tib3gtaW5uZXItY29udGFpbmVyJyk7XG5cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXRDb250YWluZXIoKSkuY2xpY2soKTtcbiAgfVxufVxuIl19