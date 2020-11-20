/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
/** Harness for interacting with a standard Material form-field's in tests. */
export class MatFormFieldHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._prefixContainer = this.locatorForOptional('.mat-form-field-prefix');
        this._suffixContainer = this.locatorForOptional('.mat-form-field-suffix');
        this._label = this.locatorForOptional('.mat-form-field-label');
        this._errors = this.locatorForAll('.mat-error');
        this._hints = this.locatorForAll('mat-hint, .mat-hint');
        this._inputControl = this.locatorForOptional(MatInputHarness);
        this._selectControl = this.locatorForOptional(MatSelectHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatFormFieldHarness, options)
            .addOption('floatingLabelText', options.floatingLabelText, (harness, text) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getLabel(), text); }))
            .addOption('hasErrors', options.hasErrors, (harness, hasErrors) => __awaiter(this, void 0, void 0, function* () { return (yield harness.hasErrors()) === hasErrors; }));
    }
    /** Gets the appearance of the form-field. */
    getAppearance() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostClasses = yield (yield this.host()).getAttribute('class');
            if (hostClasses !== null) {
                const appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
                if (appearanceMatch) {
                    return appearanceMatch[1];
                }
            }
            throw Error('Could not determine appearance of form-field.');
        });
    }
    // Implementation of the "getControl" method overload signatures.
    getControl(type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type) {
                return this.locatorForOptional(type)();
            }
            const hostEl = yield this.host();
            const [isInput, isSelect] = yield parallel(() => [
                hostEl.hasClass('mat-form-field-type-mat-input'),
                hostEl.hasClass('mat-form-field-type-mat-select'),
            ]);
            if (isInput) {
                return this._inputControl();
            }
            else if (isSelect) {
                return this._selectControl();
            }
            return null;
        });
    }
    /** Whether the form-field has a label. */
    hasLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-form-field-has-label');
        });
    }
    /** Gets the label of the form-field. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            const labelEl = yield this._label();
            return labelEl ? labelEl.text() : null;
        });
    }
    /** Whether the form-field has errors. */
    hasErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getTextErrors()).length > 0;
        });
    }
    /** Whether the label is currently floating. */
    isLabelFloating() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            const [hasLabel, shouldFloat] = yield parallel(() => [
                this.hasLabel(),
                host.hasClass('mat-form-field-should-float'),
            ]);
            // If there is no label, the label conceptually can never float. The `should-float` class
            // is just always set regardless of whether the label is displayed or not.
            return hasLabel && shouldFloat;
        });
    }
    /** Whether the form-field is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-form-field-disabled');
        });
    }
    /** Whether the form-field is currently autofilled. */
    isAutofilled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-form-field-autofilled');
        });
    }
    /** Gets the theme color of the form-field. */
    getThemeColor() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostEl = yield this.host();
            const [isAccent, isWarn] = yield parallel(() => {
                return [hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')];
            });
            if (isAccent) {
                return 'accent';
            }
            else if (isWarn) {
                return 'warn';
            }
            return 'primary';
        });
    }
    /** Gets error messages which are currently displayed in the form-field. */
    getTextErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield this._errors();
            return parallel(() => errors.map(e => e.text()));
        });
    }
    /** Gets hint messages which are currently displayed in the form-field. */
    getTextHints() {
        return __awaiter(this, void 0, void 0, function* () {
            const hints = yield this._hints();
            return parallel(() => hints.map(e => e.text()));
        });
    }
    /**
     * Gets a reference to the container element which contains all projected
     * prefixes of the form-field.
     * @deprecated Use `getPrefixText` instead.
     * @breaking-change 11.0.0
     */
    getHarnessLoaderForPrefix() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._prefixContainer();
        });
    }
    /** Gets the text inside the prefix element. */
    getPrefixText() {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = yield this._prefixContainer();
            return prefix ? prefix.text() : '';
        });
    }
    /**
     * Gets a reference to the container element which contains all projected
     * suffixes of the form-field.
     * @deprecated Use `getSuffixText` instead.
     * @breaking-change 11.0.0
     */
    getHarnessLoaderForSuffix() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._suffixContainer();
        });
    }
    /** Gets the text inside the suffix element. */
    getSuffixText() {
        return __awaiter(this, void 0, void 0, function* () {
            const suffix = yield this._suffixContainer();
            return suffix ? suffix.text() : '';
        });
    }
    /**
     * Whether the form control has been touched. Returns "null"
     * if no form control is set up.
     */
    isControlTouched() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._hasFormControl())) {
                return null;
            }
            return (yield this.host()).hasClass('ng-touched');
        });
    }
    /**
     * Whether the form control is dirty. Returns "null"
     * if no form control is set up.
     */
    isControlDirty() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._hasFormControl())) {
                return null;
            }
            return (yield this.host()).hasClass('ng-dirty');
        });
    }
    /**
     * Whether the form control is valid. Returns "null"
     * if no form control is set up.
     */
    isControlValid() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._hasFormControl())) {
                return null;
            }
            return (yield this.host()).hasClass('ng-valid');
        });
    }
    /**
     * Whether the form control is pending validation. Returns "null"
     * if no form control is set up.
     */
    isControlPending() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._hasFormControl())) {
                return null;
            }
            return (yield this.host()).hasClass('ng-pending');
        });
    }
    /** Checks whether the form-field control has set up a form control. */
    _hasFormControl() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostEl = yield this.host();
            // If no form "NgControl" is bound to the form-field control, the form-field
            // is not able to forward any control status classes. Therefore if either the
            // "ng-touched" or "ng-untouched" class is set, we know that it has a form control
            const [isTouched, isUntouched] = yield parallel(() => [hostEl.hasClass('ng-touched'), hostEl.hasClass('ng-untouched')]);
            return isTouched || isUntouched;
        });
    }
}
MatFormFieldHarness.hostSelector = '.mat-form-field';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9mb3JtLWZpZWxkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBRWhCLFFBQVEsRUFFVCxNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQVFsRSw4RUFBOEU7QUFDOUUsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGdCQUFnQjtJQUF6RDs7UUFpQlUscUJBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckUscUJBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckUsV0FBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLFdBQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFbkQsa0JBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekQsbUJBQWMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQTRNckUsQ0FBQztJQWpPQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBbUMsRUFBRTtRQUMvQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO2FBQ3RE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QUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBIYXJuZXNzUXVlcnksXG4gIHBhcmFsbGVsLFxuICBUZXN0RWxlbWVudFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge01hdElucHV0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQvdGVzdGluZyc7XG5pbXBvcnQge01hdFNlbGVjdEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdC90ZXN0aW5nJztcbmltcG9ydCB7Rm9ybUZpZWxkSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZm9ybS1maWVsZC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vLyBUT0RPKGRldnZlcnNpb24pOiBzdXBwb3J0IGRhdGVwaWNrZXIgaGFybmVzcyBvbmNlIGRldmVsb3BlZCAoQ09NUC0yMDMpLlxuLy8gQWxzbyBzdXBwb3J0IGNoaXAgbGlzdCBoYXJuZXNzLlxuLyoqIFBvc3NpYmxlIGhhcm5lc3NlcyBvZiBjb250cm9scyB3aGljaCBjYW4gYmUgYm91bmQgdG8gYSBmb3JtLWZpZWxkLiAqL1xuZXhwb3J0IHR5cGUgRm9ybUZpZWxkQ29udHJvbEhhcm5lc3MgPSBNYXRJbnB1dEhhcm5lc3N8TWF0U2VsZWN0SGFybmVzcztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBmb3JtLWZpZWxkJ3MgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Rm9ybUZpZWxkSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZm9ybS1maWVsZCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEZvcm1GaWVsZEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGZvcm0gZmllbGQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRm9ybUZpZWxkSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Rm9ybUZpZWxkSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRGb3JtRmllbGRIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbignZmxvYXRpbmdMYWJlbFRleHQnLCBvcHRpb25zLmZsb2F0aW5nTGFiZWxUZXh0LCBhc3luYyAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgaGFybmVzcy5nZXRMYWJlbCgpLCB0ZXh0KSlcbiAgICAgIC5hZGRPcHRpb24oJ2hhc0Vycm9ycycsIG9wdGlvbnMuaGFzRXJyb3JzLCBhc3luYyAoaGFybmVzcywgaGFzRXJyb3JzKSA9PlxuICAgICAgICAgIGF3YWl0IGhhcm5lc3MuaGFzRXJyb3JzKCkgPT09IGhhc0Vycm9ycyk7XG4gIH1cblxuICBwcml2YXRlIF9wcmVmaXhDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLXByZWZpeCcpO1xuICBwcml2YXRlIF9zdWZmaXhDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLXN1ZmZpeCcpO1xuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWZvcm0tZmllbGQtbGFiZWwnKTtcbiAgcHJpdmF0ZSBfZXJyb3JzID0gdGhpcy5sb2NhdG9yRm9yQWxsKCcubWF0LWVycm9yJyk7XG4gIHByaXZhdGUgX2hpbnRzID0gdGhpcy5sb2NhdG9yRm9yQWxsKCdtYXQtaGludCwgLm1hdC1oaW50Jyk7XG5cbiAgcHJpdmF0ZSBfaW5wdXRDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0SW5wdXRIYXJuZXNzKTtcbiAgcHJpdmF0ZSBfc2VsZWN0Q29udHJvbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdFNlbGVjdEhhcm5lc3MpO1xuXG4gIC8qKiBHZXRzIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRBcHBlYXJhbmNlKCk6IFByb21pc2U8J2xlZ2FjeSd8J3N0YW5kYXJkJ3wnZmlsbCd8J291dGxpbmUnPiB7XG4gICAgY29uc3QgaG9zdENsYXNzZXMgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICBpZiAoaG9zdENsYXNzZXMgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGFwcGVhcmFuY2VNYXRjaCA9XG4gICAgICAgICAgaG9zdENsYXNzZXMubWF0Y2goL21hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtKGxlZ2FjeXxzdGFuZGFyZHxmaWxsfG91dGxpbmUpKD86JHwgKS8pO1xuICAgICAgaWYgKGFwcGVhcmFuY2VNYXRjaCkge1xuICAgICAgICByZXR1cm4gYXBwZWFyYW5jZU1hdGNoWzFdIGFzICdsZWdhY3knIHwgJ3N0YW5kYXJkJyB8ICdmaWxsJyB8ICdvdXRsaW5lJztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgRXJyb3IoJ0NvdWxkIG5vdCBkZXRlcm1pbmUgYXBwZWFyYW5jZSBvZiBmb3JtLWZpZWxkLicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGhhcm5lc3Mgb2YgdGhlIGNvbnRyb2wgdGhhdCBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZC4gT25seVxuICAgKiBkZWZhdWx0IGNvbnRyb2xzIHN1Y2ggYXMgXCJNYXRJbnB1dEhhcm5lc3NcIiBhbmQgXCJNYXRTZWxlY3RIYXJuZXNzXCIgYXJlXG4gICAqIHN1cHBvcnRlZC5cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2woKTogUHJvbWlzZTxGb3JtRmllbGRDb250cm9sSGFybmVzc3xudWxsPjtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBTZWFyY2hlc1xuICAgKiBmb3IgYSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGhhcm5lc3MgdHlwZS5cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2w8WCBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPih0eXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8WD4pOlxuICAgICAgUHJvbWlzZTxYfG51bGw+O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBoYXJuZXNzIG9mIHRoZSBjb250cm9sIHRoYXQgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQuIFNlYXJjaGVzXG4gICAqIGZvciBhIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgaGFybmVzcyBwcmVkaWNhdGUuXG4gICAqL1xuICBhc3luYyBnZXRDb250cm9sPFggZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz4odHlwZTogSGFybmVzc1ByZWRpY2F0ZTxYPik6XG4gICAgICBQcm9taXNlPFh8bnVsbD47XG5cbiAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIFwiZ2V0Q29udHJvbFwiIG1ldGhvZCBvdmVybG9hZCBzaWduYXR1cmVzLlxuICBhc3luYyBnZXRDb250cm9sPFggZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz4odHlwZT86IEhhcm5lc3NRdWVyeTxYPikge1xuICAgIGlmICh0eXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwodHlwZSkoKTtcbiAgICB9XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2lzSW5wdXQsIGlzU2VsZWN0XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIGhvc3RFbC5oYXNDbGFzcygnbWF0LWZvcm0tZmllbGQtdHlwZS1tYXQtaW5wdXQnKSxcbiAgICAgIGhvc3RFbC5oYXNDbGFzcygnbWF0LWZvcm0tZmllbGQtdHlwZS1tYXQtc2VsZWN0JyksXG4gICAgXSk7XG4gICAgaWYgKGlzSW5wdXQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnB1dENvbnRyb2woKTtcbiAgICB9IGVsc2UgaWYgKGlzU2VsZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VsZWN0Q29udHJvbCgpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGhhcyBhIGxhYmVsLiAqL1xuICBhc3luYyBoYXNMYWJlbCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWZvcm0tZmllbGQtaGFzLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBsYWJlbEVsID0gYXdhaXQgdGhpcy5fbGFiZWwoKTtcbiAgICByZXR1cm4gbGFiZWxFbCA/IGxhYmVsRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGhhcyBlcnJvcnMuICovXG4gIGFzeW5jIGhhc0Vycm9ycygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0VGV4dEVycm9ycygpKS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGN1cnJlbnRseSBmbG9hdGluZy4gKi9cbiAgYXN5bmMgaXNMYWJlbEZsb2F0aW5nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaGFzTGFiZWwsIHNob3VsZEZsb2F0XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuaGFzTGFiZWwoKSxcbiAgICAgIGhvc3QuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdCcpLFxuICAgIF0pO1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGxhYmVsLCB0aGUgbGFiZWwgY29uY2VwdHVhbGx5IGNhbiBuZXZlciBmbG9hdC4gVGhlIGBzaG91bGQtZmxvYXRgIGNsYXNzXG4gICAgLy8gaXMganVzdCBhbHdheXMgc2V0IHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgbGFiZWwgaXMgZGlzcGxheWVkIG9yIG5vdC5cbiAgICByZXR1cm4gaGFzTGFiZWwgJiYgc2hvdWxkRmxvYXQ7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWZvcm0tZmllbGQtZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGlzIGN1cnJlbnRseSBhdXRvZmlsbGVkLiAqL1xuICBhc3luYyBpc0F1dG9maWxsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0aGVtZSBjb2xvciBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0VGhlbWVDb2xvcigpOiBQcm9taXNlPCdwcmltYXJ5J3wnYWNjZW50J3wnd2Fybic+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaXNBY2NlbnQsIGlzV2Fybl0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiB7XG4gICAgICByZXR1cm4gW2hvc3RFbC5oYXNDbGFzcygnbWF0LWFjY2VudCcpLCBob3N0RWwuaGFzQ2xhc3MoJ21hdC13YXJuJyldO1xuICAgIH0pO1xuICAgIGlmIChpc0FjY2VudCkge1xuICAgICAgcmV0dXJuICdhY2NlbnQnO1xuICAgIH0gZWxzZSBpZiAoaXNXYXJuKSB7XG4gICAgICByZXR1cm4gJ3dhcm4nO1xuICAgIH1cbiAgICByZXR1cm4gJ3ByaW1hcnknO1xuICB9XG5cbiAgLyoqIEdldHMgZXJyb3IgbWVzc2FnZXMgd2hpY2ggYXJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgaW4gdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldFRleHRFcnJvcnMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGVycm9ycyA9IGF3YWl0IHRoaXMuX2Vycm9ycygpO1xuICAgIHJldHVybiBwYXJhbGxlbCgoKSA9PiBlcnJvcnMubWFwKGUgPT4gZS50ZXh0KCkpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGhpbnQgbWVzc2FnZXMgd2hpY2ggYXJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgaW4gdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldFRleHRIaW50cygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgaGludHMgPSBhd2FpdCB0aGlzLl9oaW50cygpO1xuICAgIHJldHVybiBwYXJhbGxlbCgoKSA9PiBoaW50cy5tYXAoZSA9PiBlLnRleHQoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIGFsbCBwcm9qZWN0ZWRcbiAgICogcHJlZml4ZXMgb2YgdGhlIGZvcm0tZmllbGQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZ2V0UHJlZml4VGV4dGAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAgICovXG4gIGFzeW5jIGdldEhhcm5lc3NMb2FkZXJGb3JQcmVmaXgoKTogUHJvbWlzZTxUZXN0RWxlbWVudHxudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMuX3ByZWZpeENvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgaW5zaWRlIHRoZSBwcmVmaXggZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0UHJlZml4VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHByZWZpeCA9IGF3YWl0IHRoaXMuX3ByZWZpeENvbnRhaW5lcigpO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXgudGV4dCgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHJlZmVyZW5jZSB0byB0aGUgY29udGFpbmVyIGVsZW1lbnQgd2hpY2ggY29udGFpbnMgYWxsIHByb2plY3RlZFxuICAgKiBzdWZmaXhlcyBvZiB0aGUgZm9ybS1maWVsZC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRTdWZmaXhUZXh0YCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMFxuICAgKi9cbiAgYXN5bmMgZ2V0SGFybmVzc0xvYWRlckZvclN1ZmZpeCgpOiBQcm9taXNlPFRlc3RFbGVtZW50fG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5fc3VmZml4Q29udGFpbmVyKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBpbnNpZGUgdGhlIHN1ZmZpeCBlbGVtZW50LiAqL1xuICBhc3luYyBnZXRTdWZmaXhUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3Qgc3VmZml4ID0gYXdhaXQgdGhpcy5fc3VmZml4Q29udGFpbmVyKCk7XG4gICAgcmV0dXJuIHN1ZmZpeCA/IHN1ZmZpeC50ZXh0KCkgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaGFzIGJlZW4gdG91Y2hlZC4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sVG91Y2hlZCgpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy10b3VjaGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIGRpcnR5LiBSZXR1cm5zIFwibnVsbFwiXG4gICAqIGlmIG5vIGZvcm0gY29udHJvbCBpcyBzZXQgdXAuXG4gICAqL1xuICBhc3luYyBpc0NvbnRyb2xEaXJ0eSgpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1kaXJ0eScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyB2YWxpZC4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sVmFsaWQoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctdmFsaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgcGVuZGluZyB2YWxpZGF0aW9uLiBSZXR1cm5zIFwibnVsbFwiXG4gICAqIGlmIG5vIGZvcm0gY29udHJvbCBpcyBzZXQgdXAuXG4gICAqL1xuICBhc3luYyBpc0NvbnRyb2xQZW5kaW5nKCk6IFByb21pc2U8Ym9vbGVhbnxudWxsPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLl9oYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXBlbmRpbmcnKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZm9ybS1maWVsZCBjb250cm9sIGhhcyBzZXQgdXAgYSBmb3JtIGNvbnRyb2wuICovXG4gIHByaXZhdGUgYXN5bmMgX2hhc0Zvcm1Db250cm9sKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIC8vIElmIG5vIGZvcm0gXCJOZ0NvbnRyb2xcIiBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZCBjb250cm9sLCB0aGUgZm9ybS1maWVsZFxuICAgIC8vIGlzIG5vdCBhYmxlIHRvIGZvcndhcmQgYW55IGNvbnRyb2wgc3RhdHVzIGNsYXNzZXMuIFRoZXJlZm9yZSBpZiBlaXRoZXIgdGhlXG4gICAgLy8gXCJuZy10b3VjaGVkXCIgb3IgXCJuZy11bnRvdWNoZWRcIiBjbGFzcyBpcyBzZXQsIHdlIGtub3cgdGhhdCBpdCBoYXMgYSBmb3JtIGNvbnRyb2xcbiAgICBjb25zdCBbaXNUb3VjaGVkLCBpc1VudG91Y2hlZF0gPVxuICAgICAgICBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbaG9zdEVsLmhhc0NsYXNzKCduZy10b3VjaGVkJyksIGhvc3RFbC5oYXNDbGFzcygnbmctdW50b3VjaGVkJyldKTtcbiAgICByZXR1cm4gaXNUb3VjaGVkIHx8IGlzVW50b3VjaGVkO1xuICB9XG59XG4iXX0=