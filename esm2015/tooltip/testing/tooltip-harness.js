/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-tooltip in tests. */
export class MatTooltipHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-tooltip');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTooltipHarness, options);
    }
    /** Shows the tooltip. */
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hover();
        });
    }
    /** Hides the tooltip. */
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            yield host.mouseAway();
            yield this.forceStabilize(); // Needed in order to flush the `hide` animation.
        });
    }
    /** Gets whether the tooltip is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._optionalPanel());
        });
    }
    /** Gets a promise for the tooltip panel's text. */
    getTooltipText() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._optionalPanel();
            return panel ? panel.text() : '';
        });
    }
}
MatTooltipHarness.hostSelector = '.mat-tooltip-trigger';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Rvb2x0aXAvdGVzdGluZy90b29sdGlwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLG9FQUFvRTtBQUNwRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBQXZEOztRQUNVLG1CQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFtQ2hHLENBQUM7SUFoQ0M7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWlDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCx5QkFBeUI7SUFDbkIsSUFBSTs7WUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCx5QkFBeUI7SUFDbkIsSUFBSTs7WUFDUixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLGlEQUFpRDtRQUNoRixDQUFDO0tBQUE7SUFFRCx3Q0FBd0M7SUFDbEMsTUFBTTs7WUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQztLQUFBO0lBRUQsbURBQW1EO0lBQzdDLGNBQWM7O1lBQ2xCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDO0tBQUE7O0FBakNNLDhCQUFZLEdBQUcsc0JBQXNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1Rvb2x0aXBIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90b29sdGlwLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRvb2x0aXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0VG9vbHRpcEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfb3B0aW9uYWxQYW5lbCA9IHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtdG9vbHRpcCcpO1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtdG9vbHRpcC10cmlnZ2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaFxuICAgKiBmb3IgYSB0b29sdGlwIHRyaWdnZXIgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUb29sdGlwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0VG9vbHRpcEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0VG9vbHRpcEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFNob3dzIHRoZSB0b29sdGlwLiAqL1xuICBhc3luYyBzaG93KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhvdmVyKCk7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIHRvb2x0aXAuICovXG4gIGFzeW5jIGhpZGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGF3YWl0IGhvc3QubW91c2VBd2F5KCk7XG4gICAgYXdhaXQgdGhpcy5mb3JjZVN0YWJpbGl6ZSgpOyAvLyBOZWVkZWQgaW4gb3JkZXIgdG8gZmx1c2ggdGhlIGBoaWRlYCBhbmltYXRpb24uXG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSB0b29sdGlwIGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISEoYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHRvb2x0aXAgcGFuZWwncyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUb29sdGlwVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpO1xuICAgIHJldHVybiBwYW5lbCA/IHBhbmVsLnRleHQoKSA6ICcnO1xuICB9XG59XG4iXX0=