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
/** Harness for interacting with a standard mat-checkbox in tests. */
let MatCheckboxHarness = /** @class */ (() => {
    class MatCheckboxHarness extends ComponentHarness {
        constructor() {
            super(...arguments);
            this._label = this.locatorFor('.mat-checkbox-label');
            this._input = this.locatorFor('input');
            this._inputContainer = this.locatorFor('.mat-checkbox-inner-container');
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatCheckboxHarness` that meets
         * certain criteria.
         * @param options Options for filtering which checkbox instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        static with(options = {}) {
            return new HarnessPredicate(MatCheckboxHarness, options)
                .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
                // We want to provide a filter option for "name" because the name of the checkbox is
                // only set on the underlying input. This means that it's not possible for developers
                // to retrieve the harness of a specific checkbox with name through a CSS selector.
                .addOption('name', options.name, (harness, name) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getName()) === name; }));
        }
        /** Whether the checkbox is checked. */
        isChecked() {
            return __awaiter(this, void 0, void 0, function* () {
                const checked = (yield this._input()).getProperty('checked');
                return coerceBooleanProperty(yield checked);
            });
        }
        /** Whether the checkbox is in an indeterminate state. */
        isIndeterminate() {
            return __awaiter(this, void 0, void 0, function* () {
                const indeterminate = (yield this._input()).getProperty('indeterminate');
                return coerceBooleanProperty(yield indeterminate);
            });
        }
        /** Whether the checkbox is disabled. */
        isDisabled() {
            return __awaiter(this, void 0, void 0, function* () {
                const disabled = (yield this._input()).getAttribute('disabled');
                return coerceBooleanProperty(yield disabled);
            });
        }
        /** Whether the checkbox is required. */
        isRequired() {
            return __awaiter(this, void 0, void 0, function* () {
                const required = (yield this._input()).getProperty('required');
                return coerceBooleanProperty(yield required);
            });
        }
        /** Whether the checkbox is valid. */
        isValid() {
            return __awaiter(this, void 0, void 0, function* () {
                const invalid = (yield this.host()).hasClass('ng-invalid');
                return !(yield invalid);
            });
        }
        /** Gets the checkbox's name. */
        getName() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).getAttribute('name');
            });
        }
        /** Gets the checkbox's value. */
        getValue() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).getProperty('value');
            });
        }
        /** Gets the checkbox's aria-label. */
        getAriaLabel() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).getAttribute('aria-label');
            });
        }
        /** Gets the checkbox's aria-labelledby. */
        getAriaLabelledby() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).getAttribute('aria-labelledby');
            });
        }
        /** Gets the checkbox's label text. */
        getLabelText() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._label()).text();
            });
        }
        /** Focuses the checkbox. */
        focus() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).focus();
            });
        }
        /** Blurs the checkbox. */
        blur() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).blur();
            });
        }
        /** Whether the checkbox is focused. */
        isFocused() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._input()).isFocused();
            });
        }
        /**
         * Toggles the checked state of the checkbox.
         *
         * Note: This attempts to toggle the checkbox as a user would, by clicking it. Therefore if you
         * are using `MAT_CHECKBOX_CLICK_ACTION` to change the behavior on click, calling this method
         * might not have the expected result.
         */
        toggle() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._inputContainer()).click();
            });
        }
        /**
         * Puts the checkbox in a checked state by toggling it if it is currently unchecked, or doing
         * nothing if it is already checked.
         *
         * Note: This attempts to check the checkbox as a user would, by clicking it. Therefore if you
         * are using `MAT_CHECKBOX_CLICK_ACTION` to change the behavior on click, calling this method
         * might not have the expected result.
         */
        check() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.isChecked())) {
                    yield this.toggle();
                }
            });
        }
        /**
         * Puts the checkbox in an unchecked state by toggling it if it is currently checked, or doing
         * nothing if it is already unchecked.
         *
         * Note: This attempts to uncheck the checkbox as a user would, by clicking it. Therefore if you
         * are using `MAT_CHECKBOX_CLICK_ACTION` to change the behavior on click, calling this method
         * might not have the expected result.
         */
        uncheck() {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield this.isChecked()) {
                    yield this.toggle();
                }
            });
        }
    }
    /** The selector for the host element of a `MatCheckbox` instance. */
    MatCheckboxHarness.hostSelector = 'mat-checkbox';
    return MatCheckboxHarness;
})();
export { MatCheckboxHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGVja2JveC90ZXN0aW5nL2NoZWNrYm94LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLHFFQUFxRTtBQUNyRTtJQUFBLE1BQWEsa0JBQW1CLFNBQVEsZ0JBQWdCO1FBQXhEOztZQXFCVSxXQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2hELFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLG9CQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBOEc3RSxDQUFDO1FBaklDOzs7OztXQUtHO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1lBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUM7aUJBQ25ELFNBQVMsQ0FDTixPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDdEIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0RixvRkFBb0Y7Z0JBQ3BGLHFGQUFxRjtnQkFDckYsbUZBQW1GO2lCQUNsRixTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBTyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsZ0RBQUMsT0FBQSxDQUFBLE1BQU0sT0FBTyxD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QUVEOzs7Ozs7V0FNRztRQUNHLE1BQU07O2dCQUNWLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hELENBQUM7U0FBQTtRQUVEOzs7Ozs7O1dBT0c7UUFDRyxLQUFLOztnQkFDVCxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO29CQUM3QixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDckI7WUFDSCxDQUFDO1NBQUE7UUFFRDs7Ozs7OztXQU9HO1FBQ0csT0FBTzs7Z0JBQ1gsSUFBSSxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtvQkFDMUIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ3JCO1lBQ0gsQ0FBQztTQUFBOztJQW5JRCxxRUFBcUU7SUFDOUQsK0JBQVksR0FBRyxjQUFjLENBQUM7SUFtSXZDLHlCQUFDO0tBQUE7U0FySVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NoZWNrYm94SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vY2hlY2tib3gtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtY2hlY2tib3ggaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hlY2tib3hIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Q2hlY2tib3hgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1jaGVja2JveCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdENoZWNrYm94SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggY2hlY2tib3ggaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQ2hlY2tib3hIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRDaGVja2JveEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Q2hlY2tib3hIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAgICAgJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSlcbiAgICAgICAgLy8gV2Ugd2FudCB0byBwcm92aWRlIGEgZmlsdGVyIG9wdGlvbiBmb3IgXCJuYW1lXCIgYmVjYXVzZSB0aGUgbmFtZSBvZiB0aGUgY2hlY2tib3ggaXNcbiAgICAgICAgLy8gb25seSBzZXQgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQuIFRoaXMgbWVhbnMgdGhhdCBpdCdzIG5vdCBwb3NzaWJsZSBmb3IgZGV2ZWxvcGVyc1xuICAgICAgICAvLyB0byByZXRyaWV2ZSB0aGUgaGFybmVzcyBvZiBhIHNwZWNpZmljIGNoZWNrYm94IHdpdGggbmFtZSB0aHJvdWdoIGEgQ1NTIHNlbGVjdG9yLlxuICAgICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCBhc3luYyAoaGFybmVzcywgbmFtZSkgPT4gYXdhaXQgaGFybmVzcy5nZXROYW1lKCkgPT09IG5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtY2hlY2tib3gtbGFiZWwnKTtcbiAgcHJpdmF0ZSBfaW5wdXQgPSB0aGlzLmxvY2F0b3JGb3IoJ2lucHV0Jyk7XG4gIHByaXZhdGUgX2lucHV0Q29udGFpbmVyID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWNoZWNrYm94LWlubmVyLWNvbnRhaW5lcicpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgnY2hlY2tlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgY2hlY2tlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgaW4gYW4gaW5kZXRlcm1pbmF0ZSBzdGF0ZS4gKi9cbiAgYXN5bmMgaXNJbmRldGVybWluYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGluZGV0ZXJtaW5hdGUgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0UHJvcGVydHkoJ2luZGV0ZXJtaW5hdGUnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGluZGV0ZXJtaW5hdGUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXF1aXJlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgncmVxdWlyZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IHJlcXVpcmVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyB2YWxpZC4gKi9cbiAgYXN5bmMgaXNWYWxpZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBpbnZhbGlkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctaW52YWxpZCcpO1xuICAgIHJldHVybiAhKGF3YWl0IGludmFsaWQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNoZWNrYm94J3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIHZhbHVlLiAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgndmFsdWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIGFyaWEtbGFiZWwuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbCgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIGFyaWEtbGFiZWxsZWRieS4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsbGVkYnkoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjaGVja2JveCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGNoZWNrYm94LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIGNoZWNrYm94LiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIGNoZWNrYm94LlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGF0dGVtcHRzIHRvIHRvZ2dsZSB0aGUgY2hlY2tib3ggYXMgYSB1c2VyIHdvdWxkLCBieSBjbGlja2luZyBpdC4gVGhlcmVmb3JlIGlmIHlvdVxuICAgKiBhcmUgdXNpbmcgYE1BVF9DSEVDS0JPWF9DTElDS19BQ1RJT05gIHRvIGNoYW5nZSB0aGUgYmVoYXZpb3Igb24gY2xpY2ssIGNhbGxpbmcgdGhpcyBtZXRob2RcbiAgICogbWlnaHQgbm90IGhhdmUgdGhlIGV4cGVjdGVkIHJlc3VsdC5cbiAgICovXG4gIGFzeW5jIHRvZ2dsZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0Q29udGFpbmVyKCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgY2hlY2tib3ggaW4gYSBjaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSB1bmNoZWNrZWQsIG9yIGRvaW5nXG4gICAqIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGF0dGVtcHRzIHRvIGNoZWNrIHRoZSBjaGVja2JveCBhcyBhIHVzZXIgd291bGQsIGJ5IGNsaWNraW5nIGl0LiBUaGVyZWZvcmUgaWYgeW91XG4gICAqIGFyZSB1c2luZyBgTUFUX0NIRUNLQk9YX0NMSUNLX0FDVElPTmAgdG8gY2hhbmdlIHRoZSBiZWhhdmlvciBvbiBjbGljaywgY2FsbGluZyB0aGlzIG1ldGhvZFxuICAgKiBtaWdodCBub3QgaGF2ZSB0aGUgZXhwZWN0ZWQgcmVzdWx0LlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIGF3YWl0IHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIGNoZWNrYm94IGluIGFuIHVuY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgY2hlY2tlZCwgb3IgZG9pbmdcbiAgICogbm90aGluZyBpZiBpdCBpcyBhbHJlYWR5IHVuY2hlY2tlZC5cbiAgICpcbiAgICogTm90ZTogVGhpcyBhdHRlbXB0cyB0byB1bmNoZWNrIHRoZSBjaGVja2JveCBhcyBhIHVzZXIgd291bGQsIGJ5IGNsaWNraW5nIGl0LiBUaGVyZWZvcmUgaWYgeW91XG4gICAqIGFyZSB1c2luZyBgTUFUX0NIRUNLQk9YX0NMSUNLX0FDVElPTmAgdG8gY2hhbmdlIHRoZSBiZWhhdmlvciBvbiBjbGljaywgY2FsbGluZyB0aGlzIG1ldGhvZFxuICAgKiBtaWdodCBub3QgaGF2ZSB0aGUgZXhwZWN0ZWQgcmVzdWx0LlxuICAgKi9cbiAgYXN5bmMgdW5jaGVjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==