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
export class _MatFormFieldHarnessBase extends ComponentHarness {
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
    // Implementation of the "getControl" method overload signatures.
    getControl(type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type) {
                return this.locatorForOptional(type)();
            }
            const [select, input] = yield parallel(() => [this._selectControl(), this._inputControl()]);
            return select || input;
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
    /** Whether the form-field has a label. */
    hasLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-form-field-has-label');
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
}
MatFormFieldHarness.hostSelector = '.mat-form-field';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9mb3JtLWZpZWxkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFFTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBRWhCLFFBQVEsRUFFVCxNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQVFsRSxNQUFNLE9BQWdCLHdCQUNwQixTQUFRLGdCQUFnQjtJQWtCeEIsd0NBQXdDO0lBQ2xDLFFBQVE7O1lBQ1osTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEMsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUVELHlDQUF5QztJQUNuQyxTQUFTOztZQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUFBO0lBRUQsMENBQTBDO0lBQ3BDLFVBQVU7O1lBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDakUsQ0FBQztLQUFBO0lBRUQsc0RBQXNEO0lBQ2hELFlBQVk7O1lBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQXVCRCxp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Q2pCLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sZUFBZSxHQUNqQixXQUFXLENBQUMsS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7Z0JBQ3pGLElBQUksZUFBZSxFQUFFO29CQUNuQixPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQStDLENBQUM7aUJBQ3pFO2FBQ0Y7WUFDRCxNQUFNLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUVELDBDQUEwQztJQUNwQyxRQUFROztZQUNaLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7S0FBQTtJQUVELCtDQUErQztJQUN6QyxlQUFlOztZQUNuQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNuRCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUM7YUFDN0MsQ0FBQyxDQUFDO1lBQ0gseUZBQXlGO1lBQ3pGLDBFQUEwRTtZQUMxRSxPQUFPLFFBQVEsSUFBSSxXQUFXLENBQUM7UUFDakMsQ0FBQztLQUFBOztBQXBETSxnQ0FBWSxHQUFHLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFzeW5jRmFjdG9yeUZuLFxuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIEhhcm5lc3NRdWVyeSxcbiAgcGFyYWxsZWwsXG4gIFRlc3RFbGVtZW50XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9jb250cm9sJztcbmltcG9ydCB7TWF0SW5wdXRIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nJztcbmltcG9ydCB7TWF0U2VsZWN0SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHtGb3JtRmllbGRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9mb3JtLWZpZWxkLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8vIFRPRE8oZGV2dmVyc2lvbik6IHN1cHBvcnQgZGF0ZXBpY2tlciBoYXJuZXNzIG9uY2UgZGV2ZWxvcGVkIChDT01QLTIwMykuXG4vLyBBbHNvIHN1cHBvcnQgY2hpcCBsaXN0IGhhcm5lc3MuXG4vKiogUG9zc2libGUgaGFybmVzc2VzIG9mIGNvbnRyb2xzIHdoaWNoIGNhbiBiZSBib3VuZCB0byBhIGZvcm0tZmllbGQuICovXG5leHBvcnQgdHlwZSBGb3JtRmllbGRDb250cm9sSGFybmVzcyA9IE1hdElucHV0SGFybmVzc3xNYXRTZWxlY3RIYXJuZXNzO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdEZvcm1GaWVsZEhhcm5lc3NCYXNlPENvbnRyb2xIYXJuZXNzIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+XG4gIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcHJlZml4Q29udGFpbmVyOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudHxudWxsPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9zdWZmaXhDb250YWluZXI6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50fG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2xhYmVsOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudHxudWxsPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9lcnJvcnM6IEFzeW5jRmFjdG9yeUZuPFRlc3RFbGVtZW50W10+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2hpbnRzOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudFtdPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9pbnB1dENvbnRyb2w6IEFzeW5jRmFjdG9yeUZuPENvbnRyb2xIYXJuZXNzfG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3NlbGVjdENvbnRyb2w6IEFzeW5jRmFjdG9yeUZuPENvbnRyb2xIYXJuZXNzfG51bGw+O1xuXG4gIC8qKiBHZXRzIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhYnN0cmFjdCBnZXRBcHBlYXJhbmNlKCk6IFByb21pc2U8c3RyaW5nPjtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgaXMgY3VycmVudGx5IGZsb2F0aW5nLiAqL1xuICBhYnN0cmFjdCBpc0xhYmVsRmxvYXRpbmcoKTogUHJvbWlzZTxib29sZWFuPjtcblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgYSBsYWJlbC4gKi9cbiAgYWJzdHJhY3QgaGFzTGFiZWwoKTogUHJvbWlzZTxib29sZWFuPjtcblxuICAvKiogR2V0cyB0aGUgbGFiZWwgb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBsYWJlbEVsID0gYXdhaXQgdGhpcy5fbGFiZWwoKTtcbiAgICByZXR1cm4gbGFiZWxFbCA/IGxhYmVsRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGhhcyBlcnJvcnMuICovXG4gIGFzeW5jIGhhc0Vycm9ycygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0VGV4dEVycm9ycygpKS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWRpc2FibGVkJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBpcyBjdXJyZW50bHkgYXV0b2ZpbGxlZC4gKi9cbiAgYXN5bmMgaXNBdXRvZmlsbGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1hdXRvZmlsbGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBPbmx5XG4gICAqIGRlZmF1bHQgY29udHJvbHMgc3VjaCBhcyBcIk1hdElucHV0SGFybmVzc1wiIGFuZCBcIk1hdFNlbGVjdEhhcm5lc3NcIiBhcmVcbiAgICogc3VwcG9ydGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbCgpOiBQcm9taXNlPENvbnRyb2xIYXJuZXNzfG51bGw+O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBoYXJuZXNzIG9mIHRoZSBjb250cm9sIHRoYXQgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQuIFNlYXJjaGVzXG4gICAqIGZvciBhIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgaGFybmVzcyB0eXBlLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbDxYIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+KHR5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxYPik6XG4gICAgICBQcm9taXNlPFh8bnVsbD47XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGhhcm5lc3Mgb2YgdGhlIGNvbnRyb2wgdGhhdCBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZC4gU2VhcmNoZXNcbiAgICogZm9yIGEgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBoYXJuZXNzIHByZWRpY2F0ZS5cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2w8WCBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPih0eXBlOiBIYXJuZXNzUHJlZGljYXRlPFg+KTpcbiAgICAgIFByb21pc2U8WHxudWxsPjtcblxuICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgXCJnZXRDb250cm9sXCIgbWV0aG9kIG92ZXJsb2FkIHNpZ25hdHVyZXMuXG4gIGFzeW5jIGdldENvbnRyb2w8WCBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPih0eXBlPzogSGFybmVzc1F1ZXJ5PFg+KSB7XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCh0eXBlKSgpO1xuICAgIH1cbiAgICBjb25zdCBbc2VsZWN0LCBpbnB1dF0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbdGhpcy5fc2VsZWN0Q29udHJvbCgpLCB0aGlzLl9pbnB1dENvbnRyb2woKV0pO1xuICAgIHJldHVybiBzZWxlY3QgfHwgaW5wdXQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGhlbWUgY29sb3Igb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldFRoZW1lQ29sb3IoKTogUHJvbWlzZTwncHJpbWFyeSd8J2FjY2VudCd8J3dhcm4nPiB7XG4gICAgY29uc3QgaG9zdEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2lzQWNjZW50LCBpc1dhcm5dID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIFtob3N0RWwuaGFzQ2xhc3MoJ21hdC1hY2NlbnQnKSwgaG9zdEVsLmhhc0NsYXNzKCdtYXQtd2FybicpXTtcbiAgICB9KTtcbiAgICBpZiAoaXNBY2NlbnQpIHtcbiAgICAgIHJldHVybiAnYWNjZW50JztcbiAgICB9IGVsc2UgaWYgKGlzV2Fybikge1xuICAgICAgcmV0dXJuICd3YXJuJztcbiAgICB9XG4gICAgcmV0dXJuICdwcmltYXJ5JztcbiAgfVxuXG4gIC8qKiBHZXRzIGVycm9yIG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0RXJyb3JzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBlcnJvcnMgPSBhd2FpdCB0aGlzLl9lcnJvcnMoKTtcbiAgICByZXR1cm4gcGFyYWxsZWwoKCkgPT4gZXJyb3JzLm1hcChlID0+IGUudGV4dCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyBoaW50IG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0SGludHMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IGhpbnRzID0gYXdhaXQgdGhpcy5faGludHMoKTtcbiAgICByZXR1cm4gcGFyYWxsZWwoKCkgPT4gaGludHMubWFwKGUgPT4gZS50ZXh0KCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgcmVmZXJlbmNlIHRvIHRoZSBjb250YWluZXIgZWxlbWVudCB3aGljaCBjb250YWlucyBhbGwgcHJvamVjdGVkXG4gICAqIHByZWZpeGVzIG9mIHRoZSBmb3JtLWZpZWxkLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGdldFByZWZpeFRleHRgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wXG4gICAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yUHJlZml4KCk6IFByb21pc2U8VGVzdEVsZW1lbnR8bnVsbD4ge1xuICAgIHJldHVybiB0aGlzLl9wcmVmaXhDb250YWluZXIoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgcHJlZml4IGVsZW1lbnQuICovXG4gIGFzeW5jIGdldFByZWZpeFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcmVmaXggPSBhd2FpdCB0aGlzLl9wcmVmaXhDb250YWluZXIoKTtcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4LnRleHQoKSA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIGFsbCBwcm9qZWN0ZWRcbiAgICogc3VmZml4ZXMgb2YgdGhlIGZvcm0tZmllbGQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZ2V0U3VmZml4VGV4dGAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAgICovXG4gIGFzeW5jIGdldEhhcm5lc3NMb2FkZXJGb3JTdWZmaXgoKTogUHJvbWlzZTxUZXN0RWxlbWVudHxudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N1ZmZpeENvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgaW5zaWRlIHRoZSBzdWZmaXggZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0U3VmZml4VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHN1ZmZpeCA9IGF3YWl0IHRoaXMuX3N1ZmZpeENvbnRhaW5lcigpO1xuICAgIHJldHVybiBzdWZmaXggPyBzdWZmaXgudGV4dCgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGhhcyBiZWVuIHRvdWNoZWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFRvdWNoZWQoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctdG91Y2hlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyBkaXJ0eS4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sRGlydHkoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctZGlydHknKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgdmFsaWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbnxudWxsPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLl9oYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXZhbGlkJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIHBlbmRpbmcgdmFsaWRhdGlvbi4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sUGVuZGluZygpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1wZW5kaW5nJyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvcm0tZmllbGQgY29udHJvbCBoYXMgc2V0IHVwIGEgZm9ybSBjb250cm9sLiAqL1xuICBwcml2YXRlIGFzeW5jIF9oYXNGb3JtQ29udHJvbCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICAvLyBJZiBubyBmb3JtIFwiTmdDb250cm9sXCIgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQgY29udHJvbCwgdGhlIGZvcm0tZmllbGRcbiAgICAvLyBpcyBub3QgYWJsZSB0byBmb3J3YXJkIGFueSBjb250cm9sIHN0YXR1cyBjbGFzc2VzLiBUaGVyZWZvcmUgaWYgZWl0aGVyIHRoZVxuICAgIC8vIFwibmctdG91Y2hlZFwiIG9yIFwibmctdW50b3VjaGVkXCIgY2xhc3MgaXMgc2V0LCB3ZSBrbm93IHRoYXQgaXQgaGFzIGEgZm9ybSBjb250cm9sXG4gICAgY29uc3QgW2lzVG91Y2hlZCwgaXNVbnRvdWNoZWRdID1cbiAgICAgICAgYXdhaXQgcGFyYWxsZWwoKCkgPT4gW2hvc3RFbC5oYXNDbGFzcygnbmctdG91Y2hlZCcpLCBob3N0RWwuaGFzQ2xhc3MoJ25nLXVudG91Y2hlZCcpXSk7XG4gICAgcmV0dXJuIGlzVG91Y2hlZCB8fCBpc1VudG91Y2hlZDtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGZvcm0tZmllbGQncyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRIYXJuZXNzIGV4dGVuZHMgX01hdEZvcm1GaWVsZEhhcm5lc3NCYXNlPEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPiB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1mb3JtLWZpZWxkJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Rm9ybUZpZWxkSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZm9ybSBmaWVsZCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBGb3JtRmllbGRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRGb3JtRmllbGRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEZvcm1GaWVsZEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdmbG9hdGluZ0xhYmVsVGV4dCcsIG9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQsIGFzeW5jIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhhd2FpdCBoYXJuZXNzLmdldExhYmVsKCksIHRleHQpKVxuICAgICAgLmFkZE9wdGlvbignaGFzRXJyb3JzJywgb3B0aW9ucy5oYXNFcnJvcnMsIGFzeW5jIChoYXJuZXNzLCBoYXNFcnJvcnMpID0+XG4gICAgICAgICAgYXdhaXQgaGFybmVzcy5oYXNFcnJvcnMoKSA9PT0gaGFzRXJyb3JzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJlZml4Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1wcmVmaXgnKTtcbiAgcHJvdGVjdGVkIF9zdWZmaXhDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLXN1ZmZpeCcpO1xuICBwcm90ZWN0ZWQgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1sYWJlbCcpO1xuICBwcm90ZWN0ZWQgX2Vycm9ycyA9IHRoaXMubG9jYXRvckZvckFsbCgnLm1hdC1lcnJvcicpO1xuICBwcm90ZWN0ZWQgX2hpbnRzID0gdGhpcy5sb2NhdG9yRm9yQWxsKCdtYXQtaGludCwgLm1hdC1oaW50Jyk7XG4gIHByb3RlY3RlZCBfaW5wdXRDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0SW5wdXRIYXJuZXNzKTtcbiAgcHJvdGVjdGVkIF9zZWxlY3RDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0U2VsZWN0SGFybmVzcyk7XG5cbiAgLyoqIEdldHMgdGhlIGFwcGVhcmFuY2Ugb2YgdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldEFwcGVhcmFuY2UoKTogUHJvbWlzZTwnbGVnYWN5J3wnc3RhbmRhcmQnfCdmaWxsJ3wnb3V0bGluZSc+IHtcbiAgICBjb25zdCBob3N0Q2xhc3NlcyA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgIGlmIChob3N0Q2xhc3NlcyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgYXBwZWFyYW5jZU1hdGNoID1cbiAgICAgICAgICBob3N0Q2xhc3Nlcy5tYXRjaCgvbWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS0obGVnYWN5fHN0YW5kYXJkfGZpbGx8b3V0bGluZSkoPzokfCApLyk7XG4gICAgICBpZiAoYXBwZWFyYW5jZU1hdGNoKSB7XG4gICAgICAgIHJldHVybiBhcHBlYXJhbmNlTWF0Y2hbMV0gYXMgJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBFcnJvcignQ291bGQgbm90IGRldGVybWluZSBhcHBlYXJhbmNlIG9mIGZvcm0tZmllbGQuJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgYSBsYWJlbC4gKi9cbiAgYXN5bmMgaGFzTGFiZWwoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGlzIGN1cnJlbnRseSBmbG9hdGluZy4gKi9cbiAgYXN5bmMgaXNMYWJlbEZsb2F0aW5nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaGFzTGFiZWwsIHNob3VsZEZsb2F0XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuaGFzTGFiZWwoKSxcbiAgICAgIGhvc3QuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdCcpLFxuICAgIF0pO1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGxhYmVsLCB0aGUgbGFiZWwgY29uY2VwdHVhbGx5IGNhbiBuZXZlciBmbG9hdC4gVGhlIGBzaG91bGQtZmxvYXRgIGNsYXNzXG4gICAgLy8gaXMganVzdCBhbHdheXMgc2V0IHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgbGFiZWwgaXMgZGlzcGxheWVkIG9yIG5vdC5cbiAgICByZXR1cm4gaGFzTGFiZWwgJiYgc2hvdWxkRmxvYXQ7XG4gIH1cbn1cbiJdfQ==