/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-snack-bar in tests. */
export class MatSnackBarHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._messageSelector = '.mat-simple-snackbar > span';
        this._actionButtonSelector = '.mat-simple-snackbar-action > button';
        this._snackBarLiveRegion = this.locatorFor('[aria-live]');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSnackBarHarness, options);
    }
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     * @deprecated Use `getAriaLive` instead.
     * @breaking-change 13.0.0
     */
    async getRole() {
        return (await this.host()).getAttribute('role');
    }
    /**
     * Gets the aria-live of the snack-bar's live region. The aria-live of a snack-bar is
     * determined based on the ARIA politeness specified in the snack-bar config.
     */
    async getAriaLive() {
        return (await this._snackBarLiveRegion())
            .getAttribute('aria-live');
    }
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    async hasAction() {
        await this._assertContentAnnotated();
        return (await this._getActionButton()) !== null;
    }
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    async getActionDescription() {
        await this._assertHasAction();
        return (await this._getActionButton()).text();
    }
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    async dismissWithAction() {
        await this._assertHasAction();
        await (await this._getActionButton()).click();
    }
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    async getMessage() {
        await this._assertContentAnnotated();
        return (await this.locatorFor(this._messageSelector)()).text();
    }
    /** Gets whether the snack-bar has been dismissed. */
    async isDismissed() {
        // We consider the snackbar dismissed if it's not in the DOM. We can assert that the
        // element isn't in the DOM by seeing that its width and height are zero.
        const host = await this.host();
        const [exit, dimensions] = await parallel(() => [
            // The snackbar container is marked with the "exit" attribute after it has been dismissed
            // but before the animation has finished (after which it's removed from the DOM).
            host.getAttribute('mat-exit'),
            host.getDimensions(),
        ]);
        return exit != null || (!!dimensions && dimensions.height === 0 && dimensions.width === 0);
    }
    /**
     * Asserts that the current snack-bar has annotated content. Promise reject
     * if content is not annotated.
     */
    async _assertContentAnnotated() {
        if (!await this._isSimpleSnackBar()) {
            throw Error('Method cannot be used for snack-bar with custom content.');
        }
    }
    /**
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    async _assertHasAction() {
        await this._assertContentAnnotated();
        if (!await this.hasAction()) {
            throw Error('Method cannot be used for a snack-bar without an action.');
        }
    }
    /** Whether the snack-bar is using the default content template. */
    async _isSimpleSnackBar() {
        return await this.locatorForOptional('.mat-simple-snackbar')() !== null;
    }
    /** Gets the simple snack bar action button. */
    async _getActionButton() {
        return this.locatorForOptional(this._actionButtonSelector)();
    }
}
// Developers can provide a custom component or template for the
// snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
/** The selector for the host element of a `MatSnackBar` instance. */
MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR2xHLHNFQUFzRTtBQUN0RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0NBQXdDO0lBQWhGOztRQUtZLHFCQUFnQixHQUFHLDZCQUE2QixDQUFDO1FBQ2pELDBCQUFxQixHQUFHLHNDQUFzQyxDQUFDO1FBQ2pFLHdCQUFtQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFnSC9ELENBQUM7SUE5R0M7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBbUMsQ0FBQztJQUNwRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFdBQVc7UUFDZixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUNwQyxZQUFZLENBQUMsV0FBVyxDQUFnQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxTQUFTO1FBQ2IsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUNsRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLG9CQUFvQjtRQUN4QixNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUdEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxpQkFBaUI7UUFDckIsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQscURBQXFEO0lBQ3JELEtBQUssQ0FBQyxXQUFXO1FBQ2Ysb0ZBQW9GO1FBQ3BGLHlFQUF5RTtRQUV6RSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzlDLHlGQUF5RjtZQUN6RixpRkFBaUY7WUFDakYsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVEOzs7T0FHRztJQUNPLEtBQUssQ0FBQyx1QkFBdUI7UUFDckMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7WUFDbkMsTUFBTSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDTyxLQUFLLENBQUMsZ0JBQWdCO1FBQzlCLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQzNCLE1BQU0sS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQsbUVBQW1FO0lBQzNELEtBQUssQ0FBQyxpQkFBaUI7UUFDN0IsT0FBTyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDO0lBQzFFLENBQUM7SUFFRCwrQ0FBK0M7SUFDdkMsS0FBSyxDQUFDLGdCQUFnQjtRQUM1QixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDO0lBQy9ELENBQUM7O0FBckhELGdFQUFnRTtBQUNoRSwwRUFBMEU7QUFDMUUscUVBQXFFO0FBQzlELCtCQUFZLEdBQUcsMEJBQTBCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhTGl2ZVBvbGl0ZW5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1NuYWNrQmFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc25hY2stYmFyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXNuYWNrLWJhciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhckhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBzbmFja2Jhci4gVGhlIGNhbm9uaWNhbCBzbmFjay1iYXIgcGFyZW50IGlzIHRoZSBcIk1hdFNuYWNrQmFyQ29udGFpbmVyXCIuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U25hY2tCYXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc25hY2stYmFyLWNvbnRhaW5lcic7XG4gIHByb3RlY3RlZCBfbWVzc2FnZVNlbGVjdG9yID0gJy5tYXQtc2ltcGxlLXNuYWNrYmFyID4gc3Bhbic7XG4gIHByb3RlY3RlZCBfYWN0aW9uQnV0dG9uU2VsZWN0b3IgPSAnLm1hdC1zaW1wbGUtc25hY2tiYXItYWN0aW9uID4gYnV0dG9uJztcbiAgcHJpdmF0ZSBfc25hY2tCYXJMaXZlUmVnaW9uID0gdGhpcy5sb2NhdG9yRm9yKCdbYXJpYS1saXZlXScpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTbmFja0Jhckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNuYWNrIGJhciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbmFja0Jhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNuYWNrQmFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbmFja0Jhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgb2YgdGhlIHNuYWNrLWJhci4gVGhlIHJvbGUgb2YgYSBzbmFjay1iYXIgaXMgZGV0ZXJtaW5lZCBiYXNlZFxuICAgKiBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRBcmlhTGl2ZWAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTwnYWxlcnQnfCdzdGF0dXMnfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSBhcyBQcm9taXNlPCdhbGVydCd8J3N0YXR1cyd8bnVsbD47XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYXJpYS1saXZlIG9mIHRoZSBzbmFjay1iYXIncyBsaXZlIHJlZ2lvbi4gVGhlIGFyaWEtbGl2ZSBvZiBhIHNuYWNrLWJhciBpc1xuICAgKiBkZXRlcm1pbmVkIGJhc2VkIG9uIHRoZSBBUklBIHBvbGl0ZW5lc3Mgc3BlY2lmaWVkIGluIHRoZSBzbmFjay1iYXIgY29uZmlnLlxuICAgKi9cbiAgYXN5bmMgZ2V0QXJpYUxpdmUoKTogUHJvbWlzZTxBcmlhTGl2ZVBvbGl0ZW5lc3M+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NuYWNrQmFyTGl2ZVJlZ2lvbigpKVxuICAgICAgICAuZ2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnKSBhcyBQcm9taXNlPEFyaWFMaXZlUG9saXRlbmVzcz47XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBhbiBhY3Rpb24uIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGhhc0FjdGlvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRBY3Rpb25CdXR0b24oKSkgIT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRob3V0IGFjdGlvbiBvclxuICAgKiB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0QWN0aW9uRGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRIYXNBY3Rpb24oKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2dldEFjdGlvbkJ1dHRvbigpKSEudGV4dCgpO1xuICB9XG5cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBzbmFjay1iYXIgYnkgY2xpY2tpbmcgdGhlIGFjdGlvbiBidXR0b24uIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3NcbiAgICogd2l0aG91dCBhY3Rpb24gb3Igd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGRpc21pc3NXaXRoQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydEhhc0FjdGlvbigpO1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLl9nZXRBY3Rpb25CdXR0b24oKSkhLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWVzc2FnZSBvZiB0aGUgc25hY2stYmFyLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBnZXRNZXNzYWdlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0Q29udGVudEFubm90YXRlZCgpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRm9yKHRoaXMuX21lc3NhZ2VTZWxlY3RvcikoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBiZWVuIGRpc21pc3NlZC4gKi9cbiAgYXN5bmMgaXNEaXNtaXNzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIHNuYWNrYmFyIGRpc21pc3NlZCBpZiBpdCdzIG5vdCBpbiB0aGUgRE9NLiBXZSBjYW4gYXNzZXJ0IHRoYXQgdGhlXG4gICAgLy8gZWxlbWVudCBpc24ndCBpbiB0aGUgRE9NIGJ5IHNlZWluZyB0aGF0IGl0cyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLlxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IFtleGl0LCBkaW1lbnNpb25zXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIC8vIFRoZSBzbmFja2JhciBjb250YWluZXIgaXMgbWFya2VkIHdpdGggdGhlIFwiZXhpdFwiIGF0dHJpYnV0ZSBhZnRlciBpdCBoYXMgYmVlbiBkaXNtaXNzZWRcbiAgICAgIC8vIGJ1dCBiZWZvcmUgdGhlIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQgKGFmdGVyIHdoaWNoIGl0J3MgcmVtb3ZlZCBmcm9tIHRoZSBET00pLlxuICAgICAgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1leGl0JyksXG4gICAgICBob3N0LmdldERpbWVuc2lvbnMoKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBleGl0ICE9IG51bGwgfHwgKCEhZGltZW5zaW9ucyAmJiBkaW1lbnNpb25zLmhlaWdodCA9PT0gMCAmJiBkaW1lbnNpb25zLndpZHRoID09PSAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGhhcyBhbm5vdGF0ZWQgY29udGVudC4gUHJvbWlzZSByZWplY3RcbiAgICogaWYgY29udGVudCBpcyBub3QgYW5ub3RhdGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIF9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghYXdhaXQgdGhpcy5faXNTaW1wbGVTbmFja0JhcigpKSB7XG4gICAgICB0aHJvdyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIgd2l0aCBjdXN0b20gY29udGVudC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0cyB0aGF0IHRoZSBjdXJyZW50IHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uIGRlZmluZWQuIE90aGVyd2lzZSB0aGVcbiAgICogcHJvbWlzZSB3aWxsIHJlamVjdC5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBfYXNzZXJ0SGFzQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydENvbnRlbnRBbm5vdGF0ZWQoKTtcbiAgICBpZiAoIWF3YWl0IHRoaXMuaGFzQWN0aW9uKCkpIHtcbiAgICAgIHRocm93IEVycm9yKCdNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIGEgc25hY2stYmFyIHdpdGhvdXQgYW4gYWN0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjay1iYXIgaXMgdXNpbmcgdGhlIGRlZmF1bHQgY29udGVudCB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaXNTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc2ltcGxlLXNuYWNrYmFyJykoKSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzaW1wbGUgc25hY2sgYmFyIGFjdGlvbiBidXR0b24uICovXG4gIHByaXZhdGUgYXN5bmMgX2dldEFjdGlvbkJ1dHRvbigpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwodGhpcy5fYWN0aW9uQnV0dG9uU2VsZWN0b3IpKCk7XG4gIH1cbn1cbiJdfQ==