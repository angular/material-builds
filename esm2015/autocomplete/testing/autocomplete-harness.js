/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { MatOptgroupHarness, MatOptionHarness } from '@angular/material/core/testing';
export class _MatAutocompleteHarnessBase extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
    }
    /** Gets the value of the autocomplete input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('value');
        });
    }
    /** Whether the autocomplete input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Focuses the autocomplete input. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the autocomplete input. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the autocomplete input is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Enters text into the autocomplete. */
    enterText(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).sendKeys(value);
        });
    }
    /** Gets the options inside the autocomplete panel. */
    getOptions(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(this._optionClass.with(Object.assign(Object.assign({}, (filters || {})), { ancestor: yield this._getPanelSelector() })))();
        });
    }
    /** Gets the option groups inside the autocomplete panel. */
    getOptionGroups(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(this._optionGroupClass.with(Object.assign(Object.assign({}, (filters || {})), { ancestor: yield this._getPanelSelector() })))();
        });
    }
    /** Selects the first option matching the given filters. */
    selectOption(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.focus(); // Focus the input to make sure the autocomplete panel is shown.
            const options = yield this.getOptions(filters);
            if (!options.length) {
                throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
            }
            yield options[0].click();
        });
    }
    /** Whether the autocomplete is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._getPanel();
            return !!panel && (yield panel.hasClass(`${this._prefix}-autocomplete-visible`));
        });
    }
    /** Gets the panel associated with this autocomplete trigger. */
    _getPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            // Technically this is static, but it needs to be in a
            // function, because the autocomplete's panel ID can changed.
            return this._documentRootLocator.locatorForOptional(yield this._getPanelSelector())();
        });
    }
    /** Gets the selector that can be used to find the autocomplete trigger's panel. */
    _getPanelSelector() {
        return __awaiter(this, void 0, void 0, function* () {
            return `#${(yield (yield this.host()).getAttribute('aria-owns'))}`;
        });
    }
}
/** Harness for interacting with a standard mat-autocomplete in tests. */
export class MatAutocompleteHarness extends _MatAutocompleteHarnessBase {
    constructor() {
        super(...arguments);
        this._prefix = 'mat';
        this._optionClass = MatOptionHarness;
        this._optionGroupClass = MatOptgroupHarness;
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatAutocompleteHarness` that meets
     * certain criteria.
     * @param options Options for filtering which autocomplete instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatAutocompleteHarness, options)
            .addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value));
    }
}
/** The selector for the host element of a `MatAutocomplete` instance. */
MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFFTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEdBQ2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixnQkFBZ0IsRUFHakIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUd4QyxNQUFNLE9BQWdCLDJCQVNwQixTQUFRLGdCQUFnQjtJQVQxQjs7UUFVVSx5QkFBb0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztJQStFbkUsQ0FBQztJQTFFQyxnREFBZ0Q7SUFDMUMsUUFBUTs7WUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVMsT0FBTyxDQUFDLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRUQsa0RBQWtEO0lBQzVDLFVBQVU7O1lBQ2QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5RCxPQUFPLHFCQUFxQixDQUFDLE1BQU0sUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQztLQUFBO0lBRUQsc0NBQXNDO0lBQ2hDLEtBQUs7O1lBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRUQsb0NBQW9DO0lBQzlCLElBQUk7O1lBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElB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RCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7O0FBYkQseUVBQXlFO0FBQ2xFLG1DQUFZLEdBQUcsMkJBQTJCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBCYXNlSGFybmVzc0ZpbHRlcnMsXG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgTWF0T3B0Z3JvdXBIYXJuZXNzLFxuICBNYXRPcHRpb25IYXJuZXNzLFxuICBPcHRncm91cEhhcm5lc3NGaWx0ZXJzLFxuICBPcHRpb25IYXJuZXNzRmlsdGVyc1xufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlL3Rlc3RpbmcnO1xuaW1wb3J0IHtBdXRvY29tcGxldGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9hdXRvY29tcGxldGUtaGFybmVzcy1maWx0ZXJzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRBdXRvY29tcGxldGVIYXJuZXNzQmFzZTxcbiAgT3B0aW9uVHlwZSBleHRlbmRzIChDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8T3B0aW9uPiAmIHtcbiAgICB3aXRoOiAob3B0aW9ucz86IE9wdGlvbkZpbHRlcnMpID0+IEhhcm5lc3NQcmVkaWNhdGU8T3B0aW9uPn0pLFxuICBPcHRpb24gZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzICYge2NsaWNrKCk6IFByb21pc2U8dm9pZD59LFxuICBPcHRpb25GaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzLFxuICBPcHRpb25Hcm91cFR5cGUgZXh0ZW5kcyAoQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPE9wdGlvbkdyb3VwPiAmIHtcbiAgICB3aXRoOiAob3B0aW9ucz86IE9wdGlvbkdyb3VwRmlsdGVycykgPT4gSGFybmVzc1ByZWRpY2F0ZTxPcHRpb25Hcm91cD59KSxcbiAgT3B0aW9uR3JvdXAgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzLFxuICBPcHRpb25Hcm91cEZpbHRlcnMgZXh0ZW5kcyBCYXNlSGFybmVzc0ZpbHRlcnNcbj4gZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnRSb290TG9jYXRvciA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9wcmVmaXg6IHN0cmluZztcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vcHRpb25DbGFzczogT3B0aW9uVHlwZTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vcHRpb25Hcm91cENsYXNzOiBPcHRpb25Hcm91cFR5cGU7XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHk8c3RyaW5nPigndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlucHV0IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBFbnRlcnMgdGV4dCBpbnRvIHRoZSBhdXRvY29tcGxldGUuICovXG4gIGFzeW5jIGVudGVyVGV4dCh2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXModmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbnMgaW5zaWRlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVycz86IE9taXQ8T3B0aW9uRmlsdGVycywgJ2FuY2VzdG9yJz4pOiBQcm9taXNlPE9wdGlvbltdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbCh0aGlzLl9vcHRpb25DbGFzcy53aXRoKHtcbiAgICAgIC4uLihmaWx0ZXJzIHx8IHt9KSxcbiAgICAgIGFuY2VzdG9yOiBhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKClcbiAgICB9IGFzIE9wdGlvbkZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbiBncm91cHMgaW5zaWRlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXJzPzogT21pdDxPcHRpb25Hcm91cEZpbHRlcnMsICdhbmNlc3Rvcic+KTogUHJvbWlzZTxPcHRpb25Hcm91cFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbCh0aGlzLl9vcHRpb25Hcm91cENsYXNzLndpdGgoe1xuICAgICAgLi4uKGZpbHRlcnMgfHwge30pLFxuICAgICAgYW5jZXN0b3I6IGF3YWl0IHRoaXMuX2dldFBhbmVsU2VsZWN0b3IoKVxuICAgIH0gYXMgT3B0aW9uR3JvdXBGaWx0ZXJzKSkoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBmaXJzdCBvcHRpb24gbWF0Y2hpbmcgdGhlIGdpdmVuIGZpbHRlcnMuICovXG4gIGFzeW5jIHNlbGVjdE9wdGlvbihmaWx0ZXJzOiBPcHRpb25GaWx0ZXJzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5mb2N1cygpOyAvLyBGb2N1cyB0aGUgaW5wdXQgdG8gbWFrZSBzdXJlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgc2hvd24uXG4gICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IHRoaXMuZ2V0T3B0aW9ucyhmaWx0ZXJzKTtcbiAgICBpZiAoIW9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgYSBtYXQtb3B0aW9uIG1hdGNoaW5nICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVycyl9YCk7XG4gICAgfVxuICAgIGF3YWl0IG9wdGlvbnNbMF0uY2xpY2soKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fZ2V0UGFuZWwoKTtcbiAgICByZXR1cm4gISFwYW5lbCAmJiBhd2FpdCBwYW5lbC5oYXNDbGFzcyhgJHt0aGlzLl9wcmVmaXh9LWF1dG9jb21wbGV0ZS12aXNpYmxlYCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGFuZWwgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYXV0b2NvbXBsZXRlIHRyaWdnZXIuICovXG4gIHByaXZhdGUgYXN5bmMgX2dldFBhbmVsKCkge1xuICAgIC8vIFRlY2huaWNhbGx5IHRoaXMgaXMgc3RhdGljLCBidXQgaXQgbmVlZHMgdG8gYmUgaW4gYVxuICAgIC8vIGZ1bmN0aW9uLCBiZWNhdXNlIHRoZSBhdXRvY29tcGxldGUncyBwYW5lbCBJRCBjYW4gY2hhbmdlZC5cbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYXdhaXQgdGhpcy5fZ2V0UGFuZWxTZWxlY3RvcigpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNlbGVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmluZCB0aGUgYXV0b2NvbXBsZXRlIHRyaWdnZXIncyBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0UGFuZWxTZWxlY3RvcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBgIyR7KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLW93bnMnKSl9YDtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1hdXRvY29tcGxldGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlSGFybmVzcyBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVIYXJuZXNzQmFzZTxcbiAgdHlwZW9mIE1hdE9wdGlvbkhhcm5lc3MsIE1hdE9wdGlvbkhhcm5lc3MsIE9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICB0eXBlb2YgTWF0T3B0Z3JvdXBIYXJuZXNzLCBNYXRPcHRncm91cEhhcm5lc3MsIE9wdGdyb3VwSGFybmVzc0ZpbHRlcnNcbj4ge1xuICBwcm90ZWN0ZWQgX3ByZWZpeCA9ICdtYXQnO1xuICBwcm90ZWN0ZWQgX29wdGlvbkNsYXNzID0gTWF0T3B0aW9uSGFybmVzcztcbiAgcHJvdGVjdGVkIF9vcHRpb25Hcm91cENsYXNzID0gTWF0T3B0Z3JvdXBIYXJuZXNzO1xuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0QXV0b2NvbXBsZXRlYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWF1dG9jb21wbGV0ZS10cmlnZ2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0QXV0b2NvbXBsZXRlSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggYXV0b2NvbXBsZXRlIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IEF1dG9jb21wbGV0ZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEF1dG9jb21wbGV0ZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0QXV0b2NvbXBsZXRlSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndmFsdWUnLCBvcHRpb25zLnZhbHVlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHZhbHVlKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYWx1ZSgpLCB2YWx1ZSkpO1xuICB9XG59XG4iXX0=