/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
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
            const [isInput, isSelect] = yield Promise.all([
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
            const [hasLabel, shouldFloat] = yield Promise.all([
                this.hasLabel(),
                (yield this.host()).hasClass('mat-form-field-should-float'),
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
            const [isAccent, isWarn] = yield Promise.all([hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')]);
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
            return Promise.all((yield this._errors()).map(e => e.text()));
        });
    }
    /** Gets hint messages which are currently displayed in the form-field. */
    getTextHints() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all((yield this._hints()).map(e => e.text()));
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
            const [isTouched, isUntouched] = yield Promise.all([hostEl.hasClass('ng-touched'), hostEl.hasClass('ng-untouched')]);
            return isTouched || isUntouched;
        });
    }
}
MatFormFieldHarness.hostSelector = '.mat-form-field';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZy9mb3JtLWZpZWxkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBR2pCLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBUWxFLDhFQUE4RTtBQUM5RSxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsZ0JBQWdCO0lBQXpEOztRQWlCVSxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNyRSxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNyRSxXQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDMUQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0MsV0FBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUVuRCxrQkFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6RCxtQkFBYyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBd01yRSxDQUFDO0lBN05DOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFtQyxFQUFFO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUM7YUFDdEQsU0FBUyxDQUFD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QUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csY0FBYzs7WUFDbEIsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUEsRUFBRTtnQkFDakMsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxnQkFBZ0I7O1lBQ3BCLElBQUksQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBLEVBQUU7Z0JBQ2pDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEQsQ0FBQztLQUFBO0lBRUQsdUVBQXVFO0lBQ3pELGVBQWU7O1lBQzNCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pDLDRFQUE0RTtZQUM1RSw2RUFBNkU7WUFDN0Usa0ZBQWtGO1lBQ2xGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLEdBQzFCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEYsT0FBTyxTQUFTLElBQUksV0FBVyxDQUFDO1FBQ2xDLENBQUM7S0FBQTs7QUE5Tk0sZ0NBQVksR0FBRyxpQkFBaUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIEhhcm5lc3NRdWVyeSxcbiAgVGVzdEVsZW1lbnRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sSGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZC90ZXN0aW5nL2NvbnRyb2wnO1xuaW1wb3J0IHtNYXRJbnB1dEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0L3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRTZWxlY3RIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QvdGVzdGluZyc7XG5pbXBvcnQge0Zvcm1GaWVsZEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2Zvcm0tZmllbGQtaGFybmVzcy1maWx0ZXJzJztcblxuLy8gVE9ETyhkZXZ2ZXJzaW9uKTogc3VwcG9ydCBkYXRlcGlja2VyIGhhcm5lc3Mgb25jZSBkZXZlbG9wZWQgKENPTVAtMjAzKS5cbi8vIEFsc28gc3VwcG9ydCBjaGlwIGxpc3QgaGFybmVzcy5cbi8qKiBQb3NzaWJsZSBoYXJuZXNzZXMgb2YgY29udHJvbHMgd2hpY2ggY2FuIGJlIGJvdW5kIHRvIGEgZm9ybS1maWVsZC4gKi9cbmV4cG9ydCB0eXBlIEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzID0gTWF0SW5wdXRIYXJuZXNzfE1hdFNlbGVjdEhhcm5lc3M7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgZm9ybS1maWVsZCdzIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWZvcm0tZmllbGQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRGb3JtRmllbGRIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBmb3JtIGZpZWxkIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEZvcm1GaWVsZEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEZvcm1GaWVsZEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Rm9ybUZpZWxkSGFybmVzcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ2Zsb2F0aW5nTGFiZWxUZXh0Jywgb3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCwgYXN5bmMgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGF3YWl0IGhhcm5lc3MuZ2V0TGFiZWwoKSwgdGV4dCkpXG4gICAgICAuYWRkT3B0aW9uKCdoYXNFcnJvcnMnLCBvcHRpb25zLmhhc0Vycm9ycywgYXN5bmMgKGhhcm5lc3MsIGhhc0Vycm9ycykgPT5cbiAgICAgICAgICBhd2FpdCBoYXJuZXNzLmhhc0Vycm9ycygpID09PSBoYXNFcnJvcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHJlZml4Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1wcmVmaXgnKTtcbiAgcHJpdmF0ZSBfc3VmZml4Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZm9ybS1maWVsZC1zdWZmaXgnKTtcbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLWxhYmVsJyk7XG4gIHByaXZhdGUgX2Vycm9ycyA9IHRoaXMubG9jYXRvckZvckFsbCgnLm1hdC1lcnJvcicpO1xuICBwcml2YXRlIF9oaW50cyA9IHRoaXMubG9jYXRvckZvckFsbCgnbWF0LWhpbnQsIC5tYXQtaGludCcpO1xuXG4gIHByaXZhdGUgX2lucHV0Q29udHJvbCA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdElucHV0SGFybmVzcyk7XG4gIHByaXZhdGUgX3NlbGVjdENvbnRyb2wgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRTZWxlY3RIYXJuZXNzKTtcblxuICAvKiogR2V0cyB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0QXBwZWFyYW5jZSgpOiBQcm9taXNlPCdsZWdhY3knfCdzdGFuZGFyZCd8J2ZpbGwnfCdvdXRsaW5lJz4ge1xuICAgIGNvbnN0IGhvc3RDbGFzc2VzID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgaWYgKGhvc3RDbGFzc2VzICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBhcHBlYXJhbmNlTWF0Y2ggPVxuICAgICAgICAgIGhvc3RDbGFzc2VzLm1hdGNoKC9tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLShsZWdhY3l8c3RhbmRhcmR8ZmlsbHxvdXRsaW5lKSg/OiR8ICkvKTtcbiAgICAgIGlmIChhcHBlYXJhbmNlTWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGFwcGVhcmFuY2VNYXRjaFsxXSBhcyAnbGVnYWN5JyB8ICdzdGFuZGFyZCcgfCAnZmlsbCcgfCAnb3V0bGluZSc7XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IEVycm9yKCdDb3VsZCBub3QgZGV0ZXJtaW5lIGFwcGVhcmFuY2Ugb2YgZm9ybS1maWVsZC4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBoYXJuZXNzIG9mIHRoZSBjb250cm9sIHRoYXQgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQuIE9ubHlcbiAgICogZGVmYXVsdCBjb250cm9scyBzdWNoIGFzIFwiTWF0SW5wdXRIYXJuZXNzXCIgYW5kIFwiTWF0U2VsZWN0SGFybmVzc1wiIGFyZVxuICAgKiBzdXBwb3J0ZWQuXG4gICAqL1xuICBhc3luYyBnZXRDb250cm9sKCk6IFByb21pc2U8Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3N8bnVsbD47XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGhhcm5lc3Mgb2YgdGhlIGNvbnRyb2wgdGhhdCBpcyBib3VuZCB0byB0aGUgZm9ybS1maWVsZC4gU2VhcmNoZXNcbiAgICogZm9yIGEgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBoYXJuZXNzIHR5cGUuXG4gICAqL1xuICBhc3luYyBnZXRDb250cm9sPFggZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcz4odHlwZTogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFg+KTpcbiAgICAgIFByb21pc2U8WHxudWxsPjtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaGFybmVzcyBvZiB0aGUgY29udHJvbCB0aGF0IGlzIGJvdW5kIHRvIHRoZSBmb3JtLWZpZWxkLiBTZWFyY2hlc1xuICAgKiBmb3IgYSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGhhcm5lc3MgcHJlZGljYXRlLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbDxYIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+KHR5cGU6IEhhcm5lc3NQcmVkaWNhdGU8WD4pOlxuICAgICAgUHJvbWlzZTxYfG51bGw+O1xuXG4gIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBcImdldENvbnRyb2xcIiBtZXRob2Qgb3ZlcmxvYWQgc2lnbmF0dXJlcy5cbiAgYXN5bmMgZ2V0Q29udHJvbDxYIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3M+KHR5cGU/OiBIYXJuZXNzUXVlcnk8WD4pIHtcbiAgICBpZiAodHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMubG9jYXRvckZvck9wdGlvbmFsKHR5cGUpKCk7XG4gICAgfVxuICAgIGNvbnN0IGhvc3RFbCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IFtpc0lucHV0LCBpc1NlbGVjdF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBob3N0RWwuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXR5cGUtbWF0LWlucHV0JyksXG4gICAgICBob3N0RWwuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXR5cGUtbWF0LXNlbGVjdCcpLFxuICAgIF0pO1xuICAgIGlmIChpc0lucHV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5wdXRDb250cm9sKCk7XG4gICAgfSBlbHNlIGlmIChpc1NlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdENvbnRyb2woKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgYSBsYWJlbC4gKi9cbiAgYXN5bmMgaGFzTGFiZWwoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgbGFiZWxFbCA9IGF3YWl0IHRoaXMuX2xhYmVsKCk7XG4gICAgcmV0dXJuIGxhYmVsRWwgPyBsYWJlbEVsLnRleHQoKSA6IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBoYXMgZXJyb3JzLiAqL1xuICBhc3luYyBoYXNFcnJvcnMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmdldFRleHRFcnJvcnMoKSkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBpcyBjdXJyZW50bHkgZmxvYXRpbmcuICovXG4gIGFzeW5jIGlzTGFiZWxGbG9hdGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBbaGFzTGFiZWwsIHNob3VsZEZsb2F0XSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuaGFzTGFiZWwoKSxcbiAgICAgIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdCcpLFxuICAgIF0pO1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGxhYmVsLCB0aGUgbGFiZWwgY29uY2VwdHVhbGx5IGNhbiBuZXZlciBmbG9hdC4gVGhlIGBzaG91bGQtZmxvYXRgIGNsYXNzXG4gICAgLy8gaXMganVzdCBhbHdheXMgc2V0IHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgbGFiZWwgaXMgZGlzcGxheWVkIG9yIG5vdC5cbiAgICByZXR1cm4gaGFzTGFiZWwgJiYgc2hvdWxkRmxvYXQ7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZm9ybS1maWVsZCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWZvcm0tZmllbGQtZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBmb3JtLWZpZWxkIGlzIGN1cnJlbnRseSBhdXRvZmlsbGVkLiAqL1xuICBhc3luYyBpc0F1dG9maWxsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0aGVtZSBjb2xvciBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0VGhlbWVDb2xvcigpOiBQcm9taXNlPCdwcmltYXJ5J3wnYWNjZW50J3wnd2Fybic+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbaXNBY2NlbnQsIGlzV2Fybl0gPVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbaG9zdEVsLmhhc0NsYXNzKCdtYXQtYWNjZW50JyksIGhvc3RFbC5oYXNDbGFzcygnbWF0LXdhcm4nKV0pO1xuICAgIGlmIChpc0FjY2VudCkge1xuICAgICAgcmV0dXJuICdhY2NlbnQnO1xuICAgIH0gZWxzZSBpZiAoaXNXYXJuKSB7XG4gICAgICByZXR1cm4gJ3dhcm4nO1xuICAgIH1cbiAgICByZXR1cm4gJ3ByaW1hcnknO1xuICB9XG5cbiAgLyoqIEdldHMgZXJyb3IgbWVzc2FnZXMgd2hpY2ggYXJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgaW4gdGhlIGZvcm0tZmllbGQuICovXG4gIGFzeW5jIGdldFRleHRFcnJvcnMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoYXdhaXQgdGhpcy5fZXJyb3JzKCkpLm1hcChlID0+IGUudGV4dCgpKSk7XG4gIH1cblxuICAvKiogR2V0cyBoaW50IG1lc3NhZ2VzIHdoaWNoIGFyZSBjdXJyZW50bHkgZGlzcGxheWVkIGluIHRoZSBmb3JtLWZpZWxkLiAqL1xuICBhc3luYyBnZXRUZXh0SGludHMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoYXdhaXQgdGhpcy5faGludHMoKSkubWFwKGUgPT4gZS50ZXh0KCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgcmVmZXJlbmNlIHRvIHRoZSBjb250YWluZXIgZWxlbWVudCB3aGljaCBjb250YWlucyBhbGwgcHJvamVjdGVkXG4gICAqIHByZWZpeGVzIG9mIHRoZSBmb3JtLWZpZWxkLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGdldFByZWZpeFRleHRgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wXG4gICAqL1xuICBhc3luYyBnZXRIYXJuZXNzTG9hZGVyRm9yUHJlZml4KCk6IFByb21pc2U8VGVzdEVsZW1lbnR8bnVsbD4ge1xuICAgIHJldHVybiB0aGlzLl9wcmVmaXhDb250YWluZXIoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IGluc2lkZSB0aGUgcHJlZml4IGVsZW1lbnQuICovXG4gIGFzeW5jIGdldFByZWZpeFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcmVmaXggPSBhd2FpdCB0aGlzLl9wcmVmaXhDb250YWluZXIoKTtcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4LnRleHQoKSA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIGFsbCBwcm9qZWN0ZWRcbiAgICogc3VmZml4ZXMgb2YgdGhlIGZvcm0tZmllbGQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZ2V0U3VmZml4VGV4dGAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAgICovXG4gIGFzeW5jIGdldEhhcm5lc3NMb2FkZXJGb3JTdWZmaXgoKTogUHJvbWlzZTxUZXN0RWxlbWVudHxudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N1ZmZpeENvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRleHQgaW5zaWRlIHRoZSBzdWZmaXggZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0U3VmZml4VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHN1ZmZpeCA9IGF3YWl0IHRoaXMuX3N1ZmZpeENvbnRhaW5lcigpO1xuICAgIHJldHVybiBzdWZmaXggPyBzdWZmaXgudGV4dCgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGhhcyBiZWVuIHRvdWNoZWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFRvdWNoZWQoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctdG91Y2hlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZvcm0gY29udHJvbCBpcyBkaXJ0eS4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sRGlydHkoKTogUHJvbWlzZTxib29sZWFufG51bGw+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2hhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctZGlydHknKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmb3JtIGNvbnRyb2wgaXMgdmFsaWQuIFJldHVybnMgXCJudWxsXCJcbiAgICogaWYgbm8gZm9ybSBjb250cm9sIGlzIHNldCB1cC5cbiAgICovXG4gIGFzeW5jIGlzQ29udHJvbFZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbnxudWxsPiB7XG4gICAgaWYgKCFhd2FpdCB0aGlzLl9oYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLXZhbGlkJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZm9ybSBjb250cm9sIGlzIHBlbmRpbmcgdmFsaWRhdGlvbi4gUmV0dXJucyBcIm51bGxcIlxuICAgKiBpZiBubyBmb3JtIGNvbnRyb2wgaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgaXNDb250cm9sUGVuZGluZygpOiBQcm9taXNlPGJvb2xlYW58bnVsbD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1wZW5kaW5nJyk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvcm0tZmllbGQgY29udHJvbCBoYXMgc2V0IHVwIGEgZm9ybSBjb250cm9sLiAqL1xuICBwcml2YXRlIGFzeW5jIF9oYXNGb3JtQ29udHJvbCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0RWwgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICAvLyBJZiBubyBmb3JtIFwiTmdDb250cm9sXCIgaXMgYm91bmQgdG8gdGhlIGZvcm0tZmllbGQgY29udHJvbCwgdGhlIGZvcm0tZmllbGRcbiAgICAvLyBpcyBub3QgYWJsZSB0byBmb3J3YXJkIGFueSBjb250cm9sIHN0YXR1cyBjbGFzc2VzLiBUaGVyZWZvcmUgaWYgZWl0aGVyIHRoZVxuICAgIC8vIFwibmctdG91Y2hlZFwiIG9yIFwibmctdW50b3VjaGVkXCIgY2xhc3MgaXMgc2V0LCB3ZSBrbm93IHRoYXQgaXQgaGFzIGEgZm9ybSBjb250cm9sXG4gICAgY29uc3QgW2lzVG91Y2hlZCwgaXNVbnRvdWNoZWRdID1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW2hvc3RFbC5oYXNDbGFzcygnbmctdG91Y2hlZCcpLCBob3N0RWwuaGFzQ2xhc3MoJ25nLXVudG91Y2hlZCcpXSk7XG4gICAgcmV0dXJuIGlzVG91Y2hlZCB8fCBpc1VudG91Y2hlZDtcbiAgfVxufVxuIl19