/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard mat-button-toggle in tests. */
let MatButtonToggleHarness = /** @class */ (() => {
    class MatButtonToggleHarness extends ComponentHarness {
        constructor() {
            super(...arguments);
            this._label = this.locatorFor('.mat-button-toggle-label-content');
            this._button = this.locatorFor('.mat-button-toggle-button');
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
         * certain criteria.
         * @param options Options for filtering which button toggle instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        static with(options = {}) {
            return new HarnessPredicate(MatButtonToggleHarness, options)
                .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
                .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
                .addOption('checked', options.checked, (harness, checked) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isChecked()) === checked; }));
        }
        /** Gets a boolean promise indicating if the button toggle is checked. */
        isChecked() {
            return __awaiter(this, void 0, void 0, function* () {
                const checked = (yield this._button()).getAttribute('aria-pressed');
                return coerceBooleanProperty(yield checked);
            });
        }
        /** Gets a boolean promise indicating if the button toggle is disabled. */
        isDisabled() {
            return __awaiter(this, void 0, void 0, function* () {
                const disabled = (yield this._button()).getAttribute('disabled');
                return coerceBooleanProperty(yield disabled);
            });
        }
        /** Gets a promise for the button toggle's name. */
        getName() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).getAttribute('name');
            });
        }
        /** Gets a promise for the button toggle's aria-label. */
        getAriaLabel() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).getAttribute('aria-label');
            });
        }
        /** Gets a promise for the button toggles's aria-labelledby. */
        getAriaLabelledby() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).getAttribute('aria-labelledby');
            });
        }
        /** Gets a promise for the button toggle's text. */
        getText() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._label()).text();
            });
        }
        /** Gets the appearance that the button toggle is using. */
        getAppearance() {
            return __awaiter(this, void 0, void 0, function* () {
                const host = yield this.host();
                const className = 'mat-button-toggle-appearance-standard';
                return (yield host.hasClass(className)) ? 'standard' : 'legacy';
            });
        }
        /** Focuses the toggle. */
        focus() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).focus();
            });
        }
        /** Blurs the toggle. */
        blur() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).blur();
            });
        }
        /** Whether the toggle is focused. */
        isFocused() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).isFocused();
            });
        }
        /** Toggle the checked state of the buttons toggle. */
        toggle() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._button()).click();
            });
        }
        /**
         * Puts the button toggle in a checked state by toggling it if it's
         * currently unchecked, or doing nothing if it is already checked.
         */
        check() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.isChecked())) {
                    yield this.toggle();
                }
            });
        }
        /**
         * Puts the button toggle in an unchecked state by toggling it if it's
         * currently checked, or doing nothing if it's already unchecked.
         */
        uncheck() {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield this.isChecked()) {
                    yield this.toggle();
                }
            });
        }
    }
    /** The selector for the host element of a `MatButton` instance. */
    MatButtonToggleHarness.hostSelector = 'mat-button-toggle';
    return MatButtonToggleHarness;
})();
export { MatButtonToggleHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi10b2dnbGUvdGVzdGluZy9idXR0b24tdG9nZ2xlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSzVELDBFQUEwRTtBQUMxRTtJQUFBLE1BQWEsc0JBQXVCLFNBQVEsZ0JBQWdCO1FBQTVEOztZQUlVLFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDN0QsWUFBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQWdHakUsQ0FBQztRQTlGQzs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBc0MsRUFBRTtZQUNsRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDO2lCQUN2RCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDOUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzlFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9B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TSxFQUFFLENBQUM7aUJBQ3JCO1lBQ0gsQ0FBQztTQUFBOztJQW5HRCxtRUFBbUU7SUFDNUQsbUNBQVksR0FBRyxtQkFBbUIsQ0FBQztJQW1HNUMsNkJBQUM7S0FBQTtTQXJHWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZSc7XG5pbXBvcnQge0J1dHRvblRvZ2dsZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2J1dHRvbi10b2dnbGUtaGFybmVzcy1maWx0ZXJzJztcblxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1idXR0b24tdG9nZ2xlIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvblRvZ2dsZUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRCdXR0b25gIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1idXR0b24tdG9nZ2xlJztcblxuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1idXR0b24tdG9nZ2xlLWxhYmVsLWNvbnRlbnQnKTtcbiAgcHJpdmF0ZSBfYnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWJ1dHRvbi10b2dnbGUtYnV0dG9uJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEJ1dHRvblRvZ2dsZUhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGJ1dHRvbiB0b2dnbGUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQnV0dG9uVG9nZ2xlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0QnV0dG9uVG9nZ2xlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRCdXR0b25Ub2dnbGVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCkpXG4gICAgICAgIC5hZGRPcHRpb24oJ25hbWUnLCBvcHRpb25zLm5hbWUsXG4gICAgICAgICAgICAoaGFybmVzcywgbmFtZSkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TmFtZSgpLCBuYW1lKSlcbiAgICAgICAgLmFkZE9wdGlvbignY2hlY2tlZCcsIG9wdGlvbnMuY2hlY2tlZCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBjaGVja2VkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0NoZWNrZWQoKSkgPT09IGNoZWNrZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgYnV0dG9uIHRvZ2dsZSBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9idXR0b24oKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGNoZWNrZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgYnV0dG9uIHRvZ2dsZSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLl9idXR0b24oKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uIHRvZ2dsZSdzIG5hbWUuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBidXR0b24gdG9nZ2xlJ3MgYXJpYS1sYWJlbC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uIHRvZ2dsZXMncyBhcmlhLWxhYmVsbGVkYnkuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBidXR0b24gdG9nZ2xlJ3MgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFwcGVhcmFuY2UgdGhhdCB0aGUgYnV0dG9uIHRvZ2dsZSBpcyB1c2luZy4gKi9cbiAgYXN5bmMgZ2V0QXBwZWFyYW5jZSgpOiBQcm9taXNlPE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gJ21hdC1idXR0b24tdG9nZ2xlLWFwcGVhcmFuY2Utc3RhbmRhcmQnO1xuICAgIHJldHVybiBhd2FpdCBob3N0Lmhhc0NsYXNzKGNsYXNzTmFtZSkgPyAnc3RhbmRhcmQnIDogJ2xlZ2FjeSc7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgdG9nZ2xlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSB0b2dnbGUuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlIHRoZSBjaGVja2VkIHN0YXRlIG9mIHRoZSBidXR0b25zIHRvZ2dsZS4gKi9cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgYnV0dG9uIHRvZ2dsZSBpbiBhIGNoZWNrZWQgc3RhdGUgYnkgdG9nZ2xpbmcgaXQgaWYgaXQnc1xuICAgKiBjdXJyZW50bHkgdW5jaGVja2VkLCBvciBkb2luZyBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBidXR0b24gdG9nZ2xlIGluIGFuIHVuY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCdzXG4gICAqIGN1cnJlbnRseSBjaGVja2VkLCBvciBkb2luZyBub3RoaW5nIGlmIGl0J3MgYWxyZWFkeSB1bmNoZWNrZWQuXG4gICAqL1xuICBhc3luYyB1bmNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzQ2hlY2tlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxufVxuIl19