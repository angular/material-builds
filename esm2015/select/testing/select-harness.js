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
import { MatOptionHarness, MatOptgroupHarness, } from '@angular/material/core/testing';
/** Harness for interacting with a standard mat-select in tests. */
export class MatSelectHarness extends MatFormFieldControlHarness {
    constructor() {
        super(...arguments);
        this._documentRootLocator = this.documentRootLocatorFactory();
        this._backdrop = this._documentRootLocator.locatorFor('.cdk-overlay-backdrop');
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
            return (yield this.host()).hasClass('mat-select-multiple');
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
    /** Whether the select is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Gets the options inside the select panel. */
    getOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatOptionHarness.with(Object.assign(Object.assign({}, filter), { ancestor: yield this._getPanelSelector() })))();
        });
    }
    /** Gets the groups of options inside the panel. */
    getOptionGroups(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._documentRootLocator.locatorForAll(MatOptgroupHarness.with(Object.assign(Object.assign({}, filter), { ancestor: yield this._getPanelSelector() })))();
        });
    }
    /** Gets whether the select is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._documentRootLocator.locatorForOptional(yield this._getPanelSelector())());
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
    /** Gets the selector that should be used to find this select's panel. */
    _getPanelSelector() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield (yield this.host()).getAttribute('id');
            return `#${id}-panel`;
        });
    }
}
MatSelectHarness.hostSelector = '.mat-select';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvc2VsZWN0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQ3hGLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsa0JBQWtCLEdBR25CLE1BQU0sZ0NBQWdDLENBQUM7QUFJeEMsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSwwQkFBMEI7SUFBaEU7O1FBQ1UseUJBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDekQsY0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMxRSxhQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2xELFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUE0SHhELENBQUM7SUF4SEM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWdDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxtRUFBbUU7SUFDN0QsVUFBVTs7WUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7SUFFRCxnRUFBZ0U7SUFDMUQsT0FBTzs7WUFDWCxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJ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RTtnQkFDeEIsTUFBTSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQzthQUMzRTtZQUVELElBQUksVUFBVSxFQUFFO2dCQUNkLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxRDtpQkFBTTtnQkFDTCxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUMxQjtRQUNILENBQUM7S0FBQTtJQUVELGlDQUFpQztJQUMzQixLQUFLOztZQUNULElBQUksTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3ZCLHlGQUF5RjtnQkFDekYsdUZBQXVGO2dCQUN2Riw2RkFBNkY7Z0JBQzdGLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3pDO1FBQ0gsQ0FBQztLQUFBO0lBRUQseUVBQXlFO0lBQzNELGlCQUFpQjs7WUFDN0IsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELE9BQU8sSUFBSSxFQUFFLFFBQVEsQ0FBQztRQUN4QixDQUFDO0tBQUE7O0FBekhNLDZCQUFZLEdBQUcsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sSGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZC90ZXN0aW5nL2NvbnRyb2wnO1xuaW1wb3J0IHtcbiAgTWF0T3B0aW9uSGFybmVzcyxcbiAgTWF0T3B0Z3JvdXBIYXJuZXNzLFxuICBPcHRpb25IYXJuZXNzRmlsdGVycyxcbiAgT3B0Z3JvdXBIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZS90ZXN0aW5nJztcbmltcG9ydCB7U2VsZWN0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc2VsZWN0LWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2VsZWN0IGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdEhhcm5lc3MgZXh0ZW5kcyBNYXRGb3JtRmllbGRDb250cm9sSGFybmVzcyB7XG4gIHByaXZhdGUgX2RvY3VtZW50Um9vdExvY2F0b3IgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCk7XG4gIHByaXZhdGUgX2JhY2tkcm9wID0gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yKCcuY2RrLW92ZXJsYXktYmFja2Ryb3AnKTtcbiAgcHJpdmF0ZSBfdHJpZ2dlciA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zZWxlY3QtdHJpZ2dlcicpO1xuICBwcml2YXRlIF92YWx1ZSA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zZWxlY3QtdmFsdWUnKTtcblxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2VsZWN0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U2VsZWN0SGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2VsZWN0IGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNlbGVjdEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNlbGVjdEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2VsZWN0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1zZWxlY3QtZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyB2YWxpZC4gKi9cbiAgYXN5bmMgaXNWYWxpZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gIShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCduZy1pbnZhbGlkJykpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtc2VsZWN0LXJlcXVpcmVkJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3QgaXMgZW1wdHkgKG5vIHZhbHVlIGlzIHNlbGVjdGVkKS4gKi9cbiAgYXN5bmMgaXNFbXB0eSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNlbGVjdC1lbXB0eScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICBhc3luYyBpc011bHRpcGxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtc2VsZWN0LW11bHRpcGxlJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBzZWxlY3QncyB2YWx1ZSB0ZXh0LiAqL1xuICBhc3luYyBnZXRWYWx1ZVRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3ZhbHVlKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbnMgaW5zaWRlIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVyOiBPbWl0PE9wdGlvbkhhcm5lc3NGaWx0ZXJzLCAnYW5jZXN0b3InPiA9IHt9KTpcbiAgICBQcm9taXNlPE1hdE9wdGlvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3RMb2NhdG9yLmxvY2F0b3JGb3JBbGwoTWF0T3B0aW9uSGFybmVzcy53aXRoKHtcbiAgICAgIC4uLmZpbHRlcixcbiAgICAgIGFuY2VzdG9yOiBhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKClcbiAgICB9KSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBncm91cHMgb2Ygb3B0aW9ucyBpbnNpZGUgdGhlIHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25Hcm91cHMoZmlsdGVyOiBPbWl0PE9wdGdyb3VwSGFybmVzc0ZpbHRlcnMsICdhbmNlc3Rvcic+ID0ge30pOlxuICAgIFByb21pc2U8TWF0T3B0Z3JvdXBIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yQWxsKE1hdE9wdGdyb3VwSGFybmVzcy53aXRoKHtcbiAgICAgIC4uLmZpbHRlcixcbiAgICAgIGFuY2VzdG9yOiBhd2FpdCB0aGlzLl9nZXRQYW5lbFNlbGVjdG9yKClcbiAgICB9KSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNlbGVjdCBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhYXdhaXQgdGhpcy5fZG9jdW1lbnRSb290TG9jYXRvci5sb2NhdG9yRm9yT3B0aW9uYWwoYXdhaXQgdGhpcy5fZ2V0UGFuZWxTZWxlY3RvcigpKSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBzZWxlY3QncyBwYW5lbC4gKi9cbiAgYXN5bmMgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdHJpZ2dlcigpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGlja3MgdGhlIG9wdGlvbnMgdGhhdCBtYXRjaCB0aGUgcGFzc2VkLWluIGZpbHRlci4gSWYgdGhlIHNlbGVjdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb25cbiAgICogbW9kZSBhbGwgb3B0aW9ucyB3aWxsIGJlIGNsaWNrZWQsIG90aGVyd2lzZSB0aGUgaGFybmVzcyB3aWxsIHBpY2sgdGhlIGZpcnN0IG1hdGNoaW5nIG9wdGlvbi5cbiAgICovXG4gIGFzeW5jIGNsaWNrT3B0aW9ucyhmaWx0ZXI6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLm9wZW4oKTtcblxuICAgIGNvbnN0IFtpc011bHRpcGxlLCBvcHRpb25zXSA9IGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLmlzTXVsdGlwbGUoKSwgdGhpcy5nZXRPcHRpb25zKGZpbHRlcildKTtcblxuICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1NlbGVjdCBkb2VzIG5vdCBoYXZlIG9wdGlvbnMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXInKTtcbiAgICB9XG5cbiAgICBpZiAoaXNNdWx0aXBsZSkge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwob3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5jbGljaygpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IG9wdGlvbnNbMF0uY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBzZWxlY3QncyBwYW5lbC4gKi9cbiAgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIG1vc3QgY29uc2lzdGVudCB3YXkgdGhhdCB3b3JrcyBib3RoIGluIGJvdGggc2luZ2xlIGFuZCBtdWx0aS1zZWxlY3QgbW9kZXMsXG4gICAgICAvLyBidXQgaXQgYXNzdW1lcyB0aGF0IG9ubHkgb25lIG92ZXJsYXkgaXMgb3BlbiBhdCBhIHRpbWUuIFdlIHNob3VsZCBiZSBhYmxlIHRvIG1ha2UgaXRcbiAgICAgIC8vIGEgYml0IG1vcmUgcHJlY2lzZSBhZnRlciAjMTY2NDUgd2hlcmUgd2UgY2FuIGRpc3BhdGNoIGFuIEVTQ0FQRSBwcmVzcyB0byB0aGUgaG9zdCBpbnN0ZWFkLlxuICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLl9iYWNrZHJvcCgpKS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzZWxlY3RvciB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGZpbmQgdGhpcyBzZWxlY3QncyBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0UGFuZWxTZWxlY3RvcigpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgcmV0dXJuIGAjJHtpZH0tcGFuZWxgO1xuICB9XG59XG4iXX0=