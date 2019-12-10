/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatSelectOptionHarness, MatSelectOptionGroupHarness, } from './option-harness';
/** Harness for interacting with a standard mat-select in tests. */
export class MatSelectHarness extends MatFormFieldControlHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._backdrop = this._documentRootLocator.locatorFor('.cdk-overlay-backdrop');
        this._optionalPanel = this._documentRootLocator.locatorForOptional('.mat-select-panel');
        this._trigger = this.locatorFor('.mat-select-trigger');
        this._value = this.locatorFor('.mat-select-value');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSelectHarness, options);
    }
    /** Gets a boolean promise indicating if the select is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-select-disabled');
        });
    }
    /** Gets a boolean promise indicating if the select is valid. */
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield (yield this.host()).hasClass('ng-invalid'));
        });
    }
    /** Gets a boolean promise indicating if the select is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-select-required');
        });
    }
    /** Gets a boolean promise indicating if the select is empty (no value is selected). */
    isEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-select-empty');
        });
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    isMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            const ariaMultiselectable = (yield this.host()).getAttribute('aria-multiselectable');
            return (yield ariaMultiselectable) === 'true';
        });
    }
    /** Gets a promise for the select's value text. */
    getValueText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._value()).text();
        });
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Gets the options inside the select panel. */
    getOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatSelectOptionHarness.with(filter))();
        });
    }
    /** Gets the groups of options inside the panel. */
    getOptionGroups(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatSelectOptionGroupHarness.with(filter))();
        });
    }
    /** Gets whether the select is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._optionalPanel());
        });
    }
    /** Opens the select's panel. */
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isOpen())) {
                return (yield this._trigger()).click();
            }
        });
    }
    /**
     * Clicks the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    clickOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.open();
            const [isMultiple, options] = yield Promise.all([this.isMultiple(), this.getOptions(filter)]);
            if (options.length === 0) {
                throw Error('Select does not have options matching the specified filter');
            }
            if (isMultiple) {
                yield Promise.all(options.map(option => option.click()));
            }
            else {
                yield options[0].click();
            }
        });
    }
    /** Closes the select's panel. */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isOpen()) {
                // This is the most consistent way that works both in both single and multi-select modes,
                // but it assumes that only one overlay is open at a time. We should be able to make it
                // a bit more precise after #16645 where we can dispatch an ESCAPE press to the host instead.
                return (yield this._backdrop()).click();
            }
        });
    }
}
MatSelectHarness.hostSelector = '.mat-select';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvc2VsZWN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBRXhGLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsMkJBQTJCLEdBRzVCLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSwwQkFBMEI7SUFBaEU7O1FBQ1UseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDekQsY0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMxRSxtQkFBYyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25GLGFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbEQsV0FBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQTJHeEQsQ0FBQztJQXZHQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELG1FQUFtRTtJQUM3RCxVQUFVOztZQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzdELENB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QyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDMUQ7aUJBQU07Z0JBQ0wsTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDMUI7UUFDSCxDQUFDO0tBQUE7SUFFRCxpQ0FBaUM7SUFDM0IsS0FBSzs7WUFDVCxJQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUN2Qix5RkFBeUY7Z0JBQ3pGLHVGQUF1RjtnQkFDdkYsNkZBQTZGO2dCQUM3RixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUN6QztRQUNILENBQUM7S0FBQTs7QUF4R00sNkJBQVksR0FBRyxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge1NlbGVjdEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NlbGVjdC1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtcbiAgTWF0U2VsZWN0T3B0aW9uSGFybmVzcyxcbiAgTWF0U2VsZWN0T3B0aW9uR3JvdXBIYXJuZXNzLFxuICBPcHRpb25IYXJuZXNzRmlsdGVycyxcbiAgT3B0aW9uR3JvdXBIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnLi9vcHRpb24taGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNlbGVjdCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RIYXJuZXNzIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3Mge1xuICBwcml2YXRlIF9kb2N1bWVudFJvb3RMb2NhdG9yID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpO1xuICBwcml2YXRlIF9iYWNrZHJvcCA9IHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvcignLmNkay1vdmVybGF5LWJhY2tkcm9wJyk7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1zZWxlY3QtcGFuZWwnKTtcbiAgcHJpdmF0ZSBfdHJpZ2dlciA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zZWxlY3QtdHJpZ2dlcicpO1xuICBwcml2YXRlIF92YWx1ZSA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zZWxlY3QtdmFsdWUnKTtcblxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2VsZWN0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U2VsZWN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2VsZWN0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNlbGVjdEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNlbGVjdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2VsZWN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zZWxlY3QtZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyB2YWxpZC4gKi9cbiAgYXN5bmMgaXNWYWxpZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gIShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1pbnZhbGlkJykpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtc2VsZWN0LXJlcXVpcmVkJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgZW1wdHkgKG5vIHZhbHVlIGlzIHNlbGVjdGVkKS4gKi9cbiAgYXN5bmMgaXNFbXB0eSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNlbGVjdC1lbXB0eScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICBhc3luYyBpc011bHRpcGxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGFyaWFNdWx0aXNlbGVjdGFibGUgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1tdWx0aXNlbGVjdGFibGUnKTtcbiAgICByZXR1cm4gKGF3YWl0IGFyaWFNdWx0aXNlbGVjdGFibGUpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBzZWxlY3QncyB2YWx1ZSB0ZXh0LiAqL1xuICBhc3luYyBnZXRWYWx1ZVRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3ZhbHVlKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb25zIGluc2lkZSB0aGUgc2VsZWN0IHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25zKGZpbHRlcjogT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0U2VsZWN0T3B0aW9uSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdExvY2F0b3IubG9jYXRvckZvckFsbChNYXRTZWxlY3RPcHRpb25IYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBncm91cHMgb2Ygb3B0aW9ucyBpbnNpZGUgdGhlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25Hcm91cHMoZmlsdGVyOiBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pOlxuICAgICAgUHJvbWlzZTxNYXRTZWxlY3RPcHRpb25Hcm91cEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0U2VsZWN0T3B0aW9uR3JvdXBIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNlbGVjdCBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX29wdGlvbmFsUGFuZWwoKSk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHNlbGVjdCdzIHBhbmVsLiAqL1xuICBhc3luYyBvcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLl90cmlnZ2VyKCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyB0aGUgb3B0aW9ucyB0aGF0IG1hdGNoIHRoZSBwYXNzZWQtaW4gZmlsdGVyLiBJZiB0aGUgc2VsZWN0IGlzIGluIG11bHRpLXNlbGVjdGlvblxuICAgKiBtb2RlIGFsbCBvcHRpb25zIHdpbGwgYmUgY2xpY2tlZCwgb3RoZXJ3aXNlIHRoZSBoYXJuZXNzIHdpbGwgcGljayB0aGUgZmlyc3QgbWF0Y2hpbmcgb3B0aW9uLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tPcHRpb25zKGZpbHRlcjogT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMub3BlbigpO1xuXG4gICAgY29uc3QgW2lzTXVsdGlwbGUsIG9wdGlvbnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaXNNdWx0aXBsZSgpLCB0aGlzLmdldE9wdGlvbnMoZmlsdGVyKV0pO1xuXG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignU2VsZWN0IGRvZXMgbm90IGhhdmUgb3B0aW9ucyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcicpO1xuICAgIH1cblxuICAgIGlmIChpc011bHRpcGxlKSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChvcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLmNsaWNrKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgb3B0aW9uc1swXS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIHNlbGVjdCdzIHBhbmVsLiAqL1xuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoYXdhaXQgdGhpcy5pc09wZW4oKSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgbW9zdCBjb25zaXN0ZW50IHdheSB0aGF0IHdvcmtzIGJvdGggaW4gYm90aCBzaW5nbGUgYW5kIG11bHRpLXNlbGVjdCBtb2RlcyxcbiAgICAgIC8vIGJ1dCBpdCBhc3N1bWVzIHRoYXQgb25seSBvbmUgb3ZlcmxheSBpcyBvcGVuIGF0IGEgdGltZS4gV2Ugc2hvdWxkIGJlIGFibGUgdG8gbWFrZSBpdFxuICAgICAgLy8gYSBiaXQgbW9yZSBwcmVjaXNlIGFmdGVyICMxNjY0NSB3aGVyZSB3ZSBjYW4gZGlzcGF0Y2ggYW4gRVNDQVBFIHByZXNzIHRvIHRoZSBob3N0IGluc3RlYWQuXG4gICAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2JhY2tkcm9wKCkpLmNsaWNrKCk7XG4gICAgfVxuICB9XG59XG4iXX0=