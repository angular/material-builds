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
import { MatOptgroupHarness, MatOptionHarness } from '@angular/material/core/testing';
/** Harness for interacting with a standard mat-autocomplete in tests. */
let MatAutocompleteHarness = /** @class */ (() => {
    class MatAutocompleteHarness extends ComponentHarness {
        constructor() {
            super(...arguments);
            this._documentRootLocator = this.documentRootLocatorFactory();
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
        getOptions(filters = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._documentRootLocator.locatorForAll(MatOptionHarness.with(Object.assign(Object.assign({}, filters), { ancestor: yield this._getPanelSelector() })))();
            });
        }
        /** Gets the option groups inside the autocomplete panel. */
        getOptionGroups(filters = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._documentRootLocator.locatorForAll(MatOptgroupHarness.with(Object.assign(Object.assign({}, filters), { ancestor: yield this._getPanelSelector() })))();
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
                return !!panel && (yield panel.hasClass('mat-autocomplete-visible'));
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
    /** The selector for the host element of a `MatAutocomplete` instance. */
    MatAutocompleteHarness.hostSelector = '.mat-autocomplete-trigger';
    return MatAutocompleteHarness;
})();
export { MatAutocompleteHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL3Rlc3RpbmcvYXV0b2NvbXBsZXRlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBR2pCLE1BQU0sZ0NBQWdDLENBQUM7QUFHeEMseUVBQXlFO0FBQ3pFO0lBQUEsTUFBYSxzQkFBdUIsU0FBUSxnQkFBZ0I7UUFBNUQ7O1lBQ1UseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUE2Rm5FLENBQUM7UUF4RkM7Ozs7O1dBS0c7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXNDLEVBQUU7WUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQztpQkFDdkQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUM3QixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6RixDQUFDO1FBRUQsZ0RBQWdEO1FBQzFDLFFBQVE7O2dCQUNaLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsRCxDQUFDO1NBQUE7UUFFRCxrREFBa0Q7UUFDNUMsVUFBVTs7Z0JBQ2QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElB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QTtTQTlGWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7XG4gIE1hdE9wdGdyb3VwSGFybmVzcyxcbiAgTWF0T3B0aW9uSGFybmVzcyxcbiAgT3B0Z3JvdXBIYXJuZXNzRmlsdGVycyxcbiAgT3B0aW9uSGFybmVzc0ZpbHRlcnNcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZS90ZXN0aW5nJztcbmltcG9ydCB7QXV0b2NvbXBsZXRlSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vYXV0b2NvbXBsZXRlLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWF1dG9jb21wbGV0ZSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG5cbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRBdXRvY29tcGxldGVgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtYXV0b2NvbXBsZXRlLXRyaWdnZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRBdXRvY29tcGxldGVIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBhdXRvY29tcGxldGUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQXV0b2NvbXBsZXRlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0QXV0b2NvbXBsZXRlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRBdXRvY29tcGxldGVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsXG4gICAgICAgICAgICAoaGFybmVzcywgdmFsdWUpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFZhbHVlKCksIHZhbHVlKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBhdXRvY29tcGxldGUgaW5wdXQuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dC4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlucHV0IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBFbnRlcnMgdGV4dCBpbnRvIHRoZSBhdXRvY29tcGxldGUuICovXG4gIGFzeW5jIGVudGVyVGV4dCh2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXModmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbnMgaW5zaWRlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVyczogT21pdDxPcHRpb25IYXJuZXNzRmlsdGVycywgJ2FuY2VzdG9yJz4gPSB7fSk6XG4gICAgUHJvbWlzZTxNYXRPcHRpb25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKE1hdE9wdGlvbkhhcm5lc3Mud2l0aCh7XG4gICAgICAuLi5maWx0ZXJzLFxuICAgICAgYW5jZXN0b3I6IGF3YWl0IHRoaXMuX2dldFBhbmVsU2VsZWN0b3IoKVxuICAgIH0pKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbiBncm91cHMgaW5zaWRlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbkdyb3VwcyhmaWx0ZXJzOiBPbWl0PE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgIFByb21pc2U8TWF0T3B0Z3JvdXBIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKE1hdE9wdGdyb3VwSGFybmVzcy53aXRoKHtcbiAgICAgIC4uLmZpbHRlcnMsXG4gICAgICBhbmNlc3RvcjogYXdhaXQgdGhpcy5fZ2V0UGFuZWxTZWxlY3RvcigpXG4gICAgfSkpKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZmlyc3Qgb3B0aW9uIG1hdGNoaW5nIHRoZSBnaXZlbiBmaWx0ZXJzLiAqL1xuICBhc3luYyBzZWxlY3RPcHRpb24oZmlsdGVyczogT3B0aW9uSGFybmVzc0ZpbHRlcnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmZvY3VzKCk7IC8vIEZvY3VzIHRoZSBpbnB1dCB0byBtYWtlIHN1cmUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBzaG93bi5cbiAgICBjb25zdCBvcHRpb25zID0gYXdhaXQgdGhpcy5nZXRPcHRpb25zKGZpbHRlcnMpO1xuICAgIGlmICghb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZmluZCBhIG1hdC1vcHRpb24gbWF0Y2hpbmcgJHtKU09OLnN0cmluZ2lmeShmaWx0ZXJzKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgb3B0aW9uc1swXS5jbGljaygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGFuZWwgPSBhd2FpdCB0aGlzLl9nZXRQYW5lbCgpO1xuICAgIHJldHVybiAhIXBhbmVsICYmIGF3YWl0IHBhbmVsLmhhc0NsYXNzKCdtYXQtYXV0b2NvbXBsZXRlLXZpc2libGUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwYW5lbCBhc3NvY2lhdGVkIHdpdGggdGhpcyBhdXRvY29tcGxldGUgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0UGFuZWwoKSB7XG4gICAgLy8gVGVjaG5pY2FsbHkgdGhpcyBpcyBzdGF0aWMsIGJ1dCBpdCBuZWVkcyB0byBiZSBpbiBhXG4gICAgLy8gZnVuY3Rpb24sIGJlY2F1c2UgdGhlIGF1dG9jb21wbGV0ZSdzIHBhbmVsIElEIGNhbiBjaGFuZ2VkLlxuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbChhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKCkpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2VsZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBmaW5kIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlcidzIHBhbmVsLiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRQYW5lbFNlbGVjdG9yKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIGAjJHsoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtb3ducycpKX1gO1xuICB9XG59XG4iXX0=