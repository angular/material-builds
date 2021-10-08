/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatDatepickerInputHarness, MatDateRangeInputHarness, } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
export class _MatFormFieldHarnessBase extends ComponentHarness {
    /** Gets the label of the form-field. */
    async getLabel() {
        const labelEl = await this._label();
        return labelEl ? labelEl.text() : null;
    }
    /** Whether the form-field has errors. */
    async hasErrors() {
        return (await this.getTextErrors()).length > 0;
    }
    /** Whether the form-field is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-form-field-disabled');
    }
    /** Whether the form-field is currently autofilled. */
    async isAutofilled() {
        return (await this.host()).hasClass('mat-form-field-autofilled');
    }
    // Implementation of the "getControl" method overload signatures.
    async getControl(type) {
        if (type) {
            return this.locatorForOptional(type)();
        }
        const [select, input, datepickerInput, dateRangeInput] = await parallel(() => [
            this._selectControl(),
            this._inputControl(),
            this._datepickerInputControl(),
            this._dateRangeInputControl()
        ]);
        // Match the datepicker inputs first since they can also have a `MatInput`.
        return datepickerInput || dateRangeInput || select || input;
    }
    /** Gets the theme color of the form-field. */
    async getThemeColor() {
        const hostEl = await this.host();
        const [isAccent, isWarn] = await parallel(() => {
            return [hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')];
        });
        if (isAccent) {
            return 'accent';
        }
        else if (isWarn) {
            return 'warn';
        }
        return 'primary';
    }
    /** Gets error messages which are currently displayed in the form-field. */
    async getTextErrors() {
        const errors = await this._errors();
        return parallel(() => errors.map(e => e.text()));
    }
    /** Gets hint messages which are currently displayed in the form-field. */
    async getTextHints() {
        const hints = await this._hints();
        return parallel(() => hints.map(e => e.text()));
    }
    /** Gets the text inside the prefix element. */
    async getPrefixText() {
        const prefix = await this._prefixContainer();
        return prefix ? prefix.text() : '';
    }
    /** Gets the text inside the suffix element. */
    async getSuffixText() {
        const suffix = await this._suffixContainer();
        return suffix ? suffix.text() : '';
    }
    /**
     * Whether the form control has been touched. Returns "null"
     * if no form control is set up.
     */
    async isControlTouched() {
        if (!await this._hasFormControl()) {
            return null;
        }
        return (await this.host()).hasClass('ng-touched');
    }
    /**
     * Whether the form control is dirty. Returns "null"
     * if no form control is set up.
     */
    async isControlDirty() {
        if (!await this._hasFormControl()) {
            return null;
        }
        return (await this.host()).hasClass('ng-dirty');
    }
    /**
     * Whether the form control is valid. Returns "null"
     * if no form control is set up.
     */
    async isControlValid() {
        if (!await this._hasFormControl()) {
            return null;
        }
        return (await this.host()).hasClass('ng-valid');
    }
    /**
     * Whether the form control is pending validation. Returns "null"
     * if no form control is set up.
     */
    async isControlPending() {
        if (!await this._hasFormControl()) {
            return null;
        }
        return (await this.host()).hasClass('ng-pending');
    }
    /** Checks whether the form-field control has set up a form control. */
    async _hasFormControl() {
        const hostEl = await this.host();
        // If no form "NgControl" is bound to the form-field control, the form-field
        // is not able to forward any control status classes. Therefore if either the
        // "ng-touched" or "ng-untouched" class is set, we know that it has a form control
        const [isTouched, isUntouched] = await parallel(() => [hostEl.hasClass('ng-touched'), hostEl.hasClass('ng-untouched')]);
        return isTouched || isUntouched;
    }
}
/** Harness for interacting with a standard Material form-field's in tests. */
export class MatFormFieldHarness extends _MatFormFieldHarnessBase {
    constructor() {
        super(...arguments);
        this._prefixContainer = this.locatorForOptional('.mat-form-field-prefix');
        this._suffixContainer = this.locatorForOptional('.mat-form-field-suffix');
        this._label = this.locatorForOptional('.mat-form-field-label');
        this._errors = this.locatorForAll('.mat-error');
        this._hints = this.locatorForAll('mat-hint, .mat-hint');
        this._inputControl = this.locatorForOptional(MatInputHarness);
        this._selectControl = this.locatorForOptional(MatSelectHarness);
        this._datepickerInputControl = this.locatorForOptional(MatDatepickerInputHarness);
        this._dateRangeInputControl = this.locatorForOptional(MatDateRangeInputHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatFormFieldHarness, options)
            .addOption('floatingLabelText', options.floatingLabelText, async (harness, text) => HarnessPredicate.stringMatches(await harness.getLabel(), text))
            .addOption('hasErrors', options.hasErrors, async (harness, hasErrors) => await harness.hasErrors() === hasErrors);
    }
    /** Gets the appearance of the form-field. */
    async getAppearance() {
        const hostClasses = await (await this.host()).getAttribute('class');
        if (hostClasses !== null) {
            const appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
            if (appearanceMatch) {
                return appearanceMatch[1];
            }
        }
        throw Error('Could not determine appearance of form-field.');
    }
    /** Whether the form-field has a label. */
    async hasLabel() {
        return (await this.host()).hasClass('mat-form-field-has-label');
    }
    /** Whether the label is currently floating. */
    async isLabelFloating() {
        const host = await this.host();
        const [hasLabel, shouldFloat] = await parallel(() => [
            this.hasLabel(),
            host.hasClass('mat-form-field-should-float'),
        ]);
        // If there is no label, the label conceptually can never float. The `should-float` class
        // is just always set regardless of whether the label is displayed or not.
        return hasLabel && shouldFloat;
    }
}
MatFormFieldHarness.hostSelector = '.mat-form-field';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9mb3JtLWZpZWxkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdCQUFnQixFQUVoQixnQkFBZ0IsRUFFaEIsUUFBUSxFQUVULE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUNMLHlCQUF5QixFQUN6Qix3QkFBd0IsR0FDekIsTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDaEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFRbEUsTUFBTSxPQUFnQix3QkFDcEIsU0FBUSxnQkFBZ0I7SUFvQnhCLHdDQUF3QztJQUN4QyxLQUFLLENBQUMsUUFBUTtRQUNaLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxLQUFLLENBQUMsWUFBWTtRQUNoQixPQUFPLENBQUMsTUFBTSxJ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biAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBIYXJuZXNzUXVlcnksXG4gIHBhcmFsbGVsLFxuICBUZXN0RWxlbWVudFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1xuICBNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzLFxuICBNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3MsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge01hdElucHV0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQvdGVzdGluZyc7XG5pbXBvcnQge01hdFNlbGVjdEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdC90ZXN0aW5nJztcbmltcG9ydCB7Rm9ybUZpZWxkSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZm9ybS1maWVsZC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vLyBUT0RPKGRldnZlcnNpb24pOiBzdXBwb3J0IHN1cHBvcnQgY2hpcCBsaXN0IGhhcm5lc3Ncbi8qKiBQb3NzaWJsZSBoYXJuZXNzZXMgb2YgY29udHJvbHMgd2hpY2ggY2FuIGJlIGJvdW5kIHRvIGEgZm9ybS1maWVsZC4gKi9cbmV4cG9ydCB0eXBlIEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzID1cbiAgTWF0SW5wdXRIYXJuZXNzfE1hdFNlbGVjdEhhcm5lc3N8TWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc3xNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3M7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0Rm9ybUZpZWxkSGFybmVzc0Jhc2U8Q29udHJvbEhhcm5lc3MgZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz5cbiAgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9wcmVmaXhDb250YWluZXI6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50fG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3N1ZmZpeENvbnRhaW5lcjogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnR8bnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfbGFiZWw6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50fG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2Vycm9yczogQXN5bmNGYWN0b3J5Rm48VGVzdEVsZW1lbnRbXT47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaGludHM6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50W10+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2lucHV0Q29udHJvbDogQXN5bmNGYWN0b3J5Rm48Q29udHJvbEhhcm5lc3N8bnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2VsZWN0Q29udHJvbDogQXN5bmNGYWN0b3J5Rm48Q29udHJvbEhhcm5lc3N8bnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZGF0ZXBpY2tlcklucHV0Q29udHJvbDogQXN5bmNGYWN0b3J5Rm48Q29udHJvbEhhcm5lc3N8bnVsbD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZGF0ZVJhbmdlSW5wdXRDb250cm9sOiBBc3luY0ZhY3RvcnlGbjxDb250cm9sSGFybmVzc3xudWxsPjtcblxuICAvKiogR2V0cyB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYWJzdHJhY3QgZ2V0QXBwZWFyYW5jZSgpOiBQcm9taXNlPHN0cmluZz47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGN1cnJlbnRseSBmbG9hdGluZy4gKi9cbiAgYWJzdHJhY3QgaXNMYWJlbEZsb2F0aW5nKCk6IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaGFzIGEgbGFiZWwuICovXG4gIGFic3RyYWN0IGhhc0xhYmVsKCk6IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgbGFiZWxFbCA9IGF3YWl0IHRoaXMuX2xhYmVsKCk7XG4gICAgcmV0dXJuIGxhYmVsRWwgPyBsYWJlbEVsLnRleHQoKSA6IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgZXJyb3JzLiAqL1xuICBhc3luYyBoYXNFcnJvcnMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmdldFRleHRFcnJvcnMoKSkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1kaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaXMgY3VycmVudGx5IGF1dG9maWxsZWQuICovXG4gIGFzeW5jIGlzQXV0b2ZpbGxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWZvcm0tZmllbGQtYXV0b2ZpbGxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGhhcm5lc3Mgb2YgdGhlIGNvbnRyb2wgdGhhdCBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZC4gT25seVxuICAgKiBkZWZhdWx0IGNvbnRyb2xzIHN1Y2ggYXMgXCJNYXRJbnB1dEhhcm5lc3NcIiBhbmQgXCJNYXRTZWxlY3RIYXJuZXNzXCIgYXJlXG4gICAqIHN1cHBvcnRlZC5cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2woKTogUHJvbWlzZTxDb250cm9sSGFybmVzc3xudWxsPjtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBTZWFyY2hlc1xuICAgKiBmb3IgYSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGhhcm5lc3MgdHlwZS5cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2w8WCBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPih0eXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8WD4pOlxuICAgICAgUHJvbWlzZTxYfG51bGw+O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBoYXJuZXNzIG9mIHRoZSBjb250cm9sIHRoYXQgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQuIFNlYXJjaGVzXG4gICAqIGZvciBhIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgaGFybmVzcyBwcmVkaWNhdGUuXG4gICAqL1xuICBhc3luYyBnZXRDb250cm9sPFggZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz4odHlwZTogSGFybmVzc1ByZWRpY2F0ZTxYPik6XG4gICAgICBQcm9taXNlPFh8bnVsbD47XG5cbiAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIFwiZ2V0Q29udHJvbFwiIG1ldGhvZCBvdmVybG9hZCBzaWduYXR1cmVzLlxuICBhc3luYyBnZXRDb250cm9sPFggZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz4odHlwZT86IEhhcm5lc3NRdWVyeTxYPikge1xuICAgIGlmICh0eXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwodHlwZSkoKTtcbiAgICB9XG4gICAgY29uc3QgW3NlbGVjdCwgaW5wdXQsIGRhdGVwaWNrZXJJbnB1dCwgZGF0ZVJhbmdlSW5wdXRdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW1xuICAgICAgdGhpcy5fc2VsZWN0Q29udHJvbCgpLFxuICAgICAgdGhpcy5faW5wdXRDb250cm9sKCksXG4gICAgICB0aGlzLl9kYXRlcGlja2VySW5wdXRDb250cm9sKCksXG4gICAgICB0aGlzLl9kYXRlUmFuZ2VJbnB1dENvbnRyb2woKVxuICAgIF0pO1xuXG4gICAgLy8gTWF0Y2ggdGhlIGRhdGVwaWNrZXIgaW5wdXRzIGZpcnN0IHNpbmNlIHRoZXkgY2FuIGFsc28gaGF2ZSBhIGBNYXRJbnB1dGAuXG4gICAgcmV0dXJuIGRhdGVwaWNrZXJJbnB1dCB8fCBkYXRlUmFuZ2VJbnB1dCB8fCBzZWxlY3QgfHwgaW5wdXQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGhlbWUgY29sb3Igb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldFRoZW1lQ29sb3IoKTogUHJvbWlzZTwncHJpbWFyeSd8J2FjY2VudCd8J3dhcm4nPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2lzQWNjZW50LCBpc1dhcm5dID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIFtob3N0RWwuaGFzQ2xhc3MoJ21hdC1hY2NlbnQnKSwgaG9zdEVsLmhhc0NsYXNzKCdtYXQtd2FybicpXTtcbiAgICB9KTtcbiAgICBpZiAoaXNBY2NlbnQpIHtcbiAgICAgIHJldHVybiAnYWNjZW50JztcbiAgICB9IGVsc2UgaWYgKGlzV2Fybikge1xuICAgICAgcmV0dXJuICd3YXJuJztcbiAgICB9XG4gICAgcmV0dXJuICdwcmltYXJ5JztcbiAgfVxuXG4gIC8qKiBHZXRzIGVycm9yIG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0RXJyb3JzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBlcnJvcnMgPSBhd2FpdCB0aGlzLl9lcnJvcnMoKTtcbiAgICByZXR1cm4gcGFyYWxsZWwoKCkgPT4gZXJyb3JzLm1hcChlID0+IGUudGV4dCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyBoaW50IG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0SGludHMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGhpbnRzID0gYXdhaXQgdGhpcy5faGludHMoKTtcbiAgICByZXR1cm4gcGFyYWxsZWwoKCkgPT4gaGludHMubWFwKGUgPT4gZS50ZXh0KCkpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgcHJlZml4IGVsZW1lbnQuICovXG4gIGFzeW5jIGdldFByZWZpeFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcmVmaXggPSBhd2FpdCB0aGlzLl9wcmVmaXhDb250YWluZXIoKTtcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4LnRleHQoKSA6ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgaW5zaWRlIHRoZSBzdWZmaXggZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0U3VmZml4VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHN1ZmZpeCA9IGF3YWl0IHRoaXMuX3N1ZmZpeENvbnRhaW5lcigpO1xuICAgIHJldHVybiBzdWZmaXggPyBzdWZmaXgudGV4dCgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGhhcyBiZWVuIHRvdWNoZWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFRvdWNoZWQoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctdG91Y2hlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyBkaXJ0eS4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sRGlydHkoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctZGlydHknKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgdmFsaWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbnxudWxsPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLl9oYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXZhbGlkJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIHBlbmRpbmcgdmFsaWRhdGlvbi4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sUGVuZGluZygpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1wZW5kaW5nJyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvcm0tZmllbGQgY29udHJvbCBoYXMgc2V0IHVwIGEgZm9ybSBjb250cm9sLiAqL1xuICBwcml2YXRlIGFzeW5jIF9oYXNGb3JtQ29udHJvbCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICAvLyBJZiBubyBmb3JtIFwiTmdDb250cm9sXCIgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQgY29udHJvbCwgdGhlIGZvcm0tZmllbGRcbiAgICAvLyBpcyBub3QgYWJsZSB0byBmb3J3YXJkIGFueSBjb250cm9sIHN0YXR1cyBjbGFzc2VzLiBUaGVyZWZvcmUgaWYgZWl0aGVyIHRoZVxuICAgIC8vIFwibmctdG91Y2hlZFwiIG9yIFwibmctdW50b3VjaGVkXCIgY2xhc3MgaXMgc2V0LCB3ZSBrbm93IHRoYXQgaXQgaGFzIGEgZm9ybSBjb250cm9sXG4gICAgY29uc3QgW2lzVG91Y2hlZCwgaXNVbnRvdWNoZWRdID1cbiAgICAgICAgYXdhaXQgcGFyYWxsZWwoKCkgPT4gW2hvc3RFbC5oYXNDbGFzcygnbmctdG91Y2hlZCcpLCBob3N0RWwuaGFzQ2xhc3MoJ25nLXVudG91Y2hlZCcpXSk7XG4gICAgcmV0dXJuIGlzVG91Y2hlZCB8fCBpc1VudG91Y2hlZDtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGZvcm0tZmllbGQncyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRIYXJuZXNzIGV4dGVuZHMgX01hdEZvcm1GaWVsZEhhcm5lc3NCYXNlPEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPiB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1mb3JtLWZpZWxkJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Rm9ybUZpZWxkSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZm9ybSBmaWVsZCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBGb3JtRmllbGRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRGb3JtRmllbGRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEZvcm1GaWVsZEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdmbG9hdGluZ0xhYmVsVGV4dCcsIG9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQsIGFzeW5jIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhhd2FpdCBoYXJuZXNzLmdldExhYmVsKCksIHRleHQpKVxuICAgICAgLmFkZE9wdGlvbignaGFzRXJyb3JzJywgb3B0aW9ucy5oYXNFcnJvcnMsIGFzeW5jIChoYXJuZXNzLCBoYXNFcnJvcnMpID0+XG4gICAgICAgICAgYXdhaXQgaGFybmVzcy5oYXNFcnJvcnMoKSA9PT0gaGFzRXJyb3JzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJlZml4Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1wcmVmaXgnKTtcbiAgcHJvdGVjdGVkIF9zdWZmaXhDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLXN1ZmZpeCcpO1xuICBwcm90ZWN0ZWQgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1sYWJlbCcpO1xuICBwcm90ZWN0ZWQgX2Vycm9ycyA9IHRoaXMubG9jYXRvckZvckFsbCgnLm1hdC1lcnJvcicpO1xuICBwcm90ZWN0ZWQgX2hpbnRzID0gdGhpcy5sb2NhdG9yRm9yQWxsKCdtYXQtaGludCwgLm1hdC1oaW50Jyk7XG4gIHByb3RlY3RlZCBfaW5wdXRDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0SW5wdXRIYXJuZXNzKTtcbiAgcHJvdGVjdGVkIF9zZWxlY3RDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0U2VsZWN0SGFybmVzcyk7XG4gIHByb3RlY3RlZCBfZGF0ZXBpY2tlcklucHV0Q29udHJvbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3MpO1xuICBwcm90ZWN0ZWQgX2RhdGVSYW5nZUlucHV0Q29udHJvbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdERhdGVSYW5nZUlucHV0SGFybmVzcyk7XG5cbiAgLyoqIEdldHMgdGhlIGFwcGVhcmFuY2Ugb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldEFwcGVhcmFuY2UoKTogUHJvbWlzZTwnbGVnYWN5J3wnc3RhbmRhcmQnfCdmaWxsJ3wnb3V0bGluZSc+IHtcbiAgICBjb25zdCBob3N0Q2xhc3NlcyA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgIGlmIChob3N0Q2xhc3NlcyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgYXBwZWFyYW5jZU1hdGNoID1cbiAgICAgICAgICBob3N0Q2xhc3Nlcy5tYXRjaCgvbWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS0obGVnYWN5fHN0YW5kYXJkfGZpbGx8b3V0bGluZSkoPzokfCApLyk7XG4gICAgICBpZiAoYXBwZWFyYW5jZU1hdGNoKSB7XG4gICAgICAgIHJldHVybiBhcHBlYXJhbmNlTWF0Y2hbMV0gYXMgJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGRldGVybWluZSBhcHBlYXJhbmNlIG9mIGZvcm0tZmllbGQuJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgYSBsYWJlbC4gKi9cbiAgYXN5bmMgaGFzTGFiZWwoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGN1cnJlbnRseSBmbG9hdGluZy4gKi9cbiAgYXN5bmMgaXNMYWJlbEZsb2F0aW5nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaGFzTGFiZWwsIHNob3VsZEZsb2F0XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuaGFzTGFiZWwoKSxcbiAgICAgIGhvc3QuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdCcpLFxuICAgIF0pO1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGxhYmVsLCB0aGUgbGFiZWwgY29uY2VwdHVhbGx5IGNhbiBuZXZlciBmbG9hdC4gVGhlIGBzaG91bGQtZmxvYXRgIGNsYXNzXG4gICAgLy8gaXMganVzdCBhbHdheXMgc2V0IHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgbGFiZWwgaXMgZGlzcGxheWVkIG9yIG5vdC5cbiAgICByZXR1cm4gaGFzTGFiZWwgJiYgc2hvdWxkRmxvYXQ7XG4gIH1cbn1cbiJdfQ==