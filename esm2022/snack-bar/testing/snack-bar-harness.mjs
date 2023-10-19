/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
/** Harness for interacting with an MDC-based mat-snack-bar in tests. */
export class MatSnackBarHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._messageSelector = '.mdc-snackbar__label';
        this._actionButtonSelector = '.mat-mdc-snack-bar-action';
        this._snackBarLiveRegion = this.locatorFor('[aria-live]');
    }
    // Developers can provide a custom component or template for the
    // snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
    /** The selector for the host element of a `MatSnackBar` instance. */
    static { this.hostSelector = '.mat-mdc-snack-bar-container:not([mat-exit])'; }
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
        return (await this._snackBarLiveRegion()).getAttribute('aria-live');
    }
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    async hasAction() {
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
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    async _assertHasAction() {
        if (!(await this.hasAction())) {
            throw Error('Method cannot be used for a snack-bar without an action.');
        }
    }
    /** Gets the simple snack bar action button. */
    async _getActionButton() {
        return this.locatorForOptional(this._actionButtonSelector)();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSWxHLHdFQUF3RTtBQUN4RSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0NBQXdDO0lBQWhGOztRQUtVLHFCQUFnQixHQUFHLHNCQUFzQixDQUFDO1FBQzFDLDBCQUFxQixHQUFHLDJCQUEyQixDQUFDO1FBRXBELHdCQUFtQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUE4Ri9ELENBQUM7SUFyR0MsZ0VBQWdFO0lBQ2hFLDBFQUEwRTtJQUMxRSxxRUFBcUU7YUFDOUQsaUJBQVksR0FBRyw4Q0FBOEMsQUFBakQsQ0FBa0Q7SUFNckU7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBdUMsQ0FBQztJQUN4RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFdBQVc7UUFDZixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FDcEQsV0FBVyxDQUNtQixDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxvQkFBb0I7UUFDeEIsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsaUJBQWlCO1FBQ3JCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRCxxREFBcUQ7SUFDckQsS0FBSyxDQUFDLFdBQVc7UUFDZixvRkFBb0Y7UUFDcEYseUVBQXlFO1FBRXpFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDOUMseUZBQXlGO1lBQ3pGLGlGQUFpRjtZQUNqRixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsYUFBYSxFQUFFO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssS0FBSyxDQUFDLGdCQUFnQjtRQUM1QixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQsK0NBQStDO0lBQ3ZDLEtBQUssQ0FBQyxnQkFBZ0I7UUFDNUIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQztJQUMvRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0FyaWFMaXZlUG9saXRlbmVzc30gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtTbmFja0Jhckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NuYWNrLWJhci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhbiBNREMtYmFzZWQgbWF0LXNuYWNrLWJhciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhckhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLy8gRGV2ZWxvcGVycyBjYW4gcHJvdmlkZSBhIGN1c3RvbSBjb21wb25lbnQgb3IgdGVtcGxhdGUgZm9yIHRoZVxuICAvLyBzbmFja2Jhci4gVGhlIGNhbm9uaWNhbCBzbmFjay1iYXIgcGFyZW50IGlzIHRoZSBcIk1hdFNuYWNrQmFyQ29udGFpbmVyXCIuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U25hY2tCYXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtbWRjLXNuYWNrLWJhci1jb250YWluZXI6bm90KFttYXQtZXhpdF0pJztcbiAgcHJpdmF0ZSBfbWVzc2FnZVNlbGVjdG9yID0gJy5tZGMtc25hY2tiYXJfX2xhYmVsJztcbiAgcHJpdmF0ZSBfYWN0aW9uQnV0dG9uU2VsZWN0b3IgPSAnLm1hdC1tZGMtc25hY2stYmFyLWFjdGlvbic7XG5cbiAgcHJpdmF0ZSBfc25hY2tCYXJMaXZlUmVnaW9uID0gdGhpcy5sb2NhdG9yRm9yKCdbYXJpYS1saXZlXScpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTbmFja0Jhckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNuYWNrIGJhciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbmFja0Jhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNuYWNrQmFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbmFja0Jhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgb2YgdGhlIHNuYWNrLWJhci4gVGhlIHJvbGUgb2YgYSBzbmFjay1iYXIgaXMgZGV0ZXJtaW5lZCBiYXNlZFxuICAgKiBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRBcmlhTGl2ZWAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTwnYWxlcnQnIHwgJ3N0YXR1cycgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTwnYWxlcnQnIHwgJ3N0YXR1cycgfCBudWxsPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcmlhLWxpdmUgb2YgdGhlIHNuYWNrLWJhcidzIGxpdmUgcmVnaW9uLiBUaGUgYXJpYS1saXZlIG9mIGEgc25hY2stYmFyIGlzXG4gICAqIGRldGVybWluZWQgYmFzZWQgb24gdGhlIEFSSUEgcG9saXRlbmVzcyBzcGVjaWZpZWQgaW4gdGhlIHNuYWNrLWJhciBjb25maWcuXG4gICAqL1xuICBhc3luYyBnZXRBcmlhTGl2ZSgpOiBQcm9taXNlPEFyaWFMaXZlUG9saXRlbmVzcz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc25hY2tCYXJMaXZlUmVnaW9uKCkpLmdldEF0dHJpYnV0ZShcbiAgICAgICdhcmlhLWxpdmUnLFxuICAgICkgYXMgUHJvbWlzZTxBcmlhTGl2ZVBvbGl0ZW5lc3M+O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBoYXNBY3Rpb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRBY3Rpb25CdXR0b24oKSkgIT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRob3V0IGFjdGlvbiBvclxuICAgKiB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0QWN0aW9uRGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRIYXNBY3Rpb24oKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2dldEFjdGlvbkJ1dHRvbigpKSEudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgc25hY2stYmFyIGJ5IGNsaWNraW5nIHRoZSBhY3Rpb24gYnV0dG9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzXG4gICAqIHdpdGhvdXQgYWN0aW9uIG9yIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBkaXNtaXNzV2l0aEFjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRIYXNBY3Rpb24oKTtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5fZ2V0QWN0aW9uQnV0dG9uKCkpIS5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1lc3NhZ2Ugb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0TWVzc2FnZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5sb2NhdG9yRm9yKHRoaXMuX21lc3NhZ2VTZWxlY3RvcikoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBiZWVuIGRpc21pc3NlZC4gKi9cbiAgYXN5bmMgaXNEaXNtaXNzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIHNuYWNrYmFyIGRpc21pc3NlZCBpZiBpdCdzIG5vdCBpbiB0aGUgRE9NLiBXZSBjYW4gYXNzZXJ0IHRoYXQgdGhlXG4gICAgLy8gZWxlbWVudCBpc24ndCBpbiB0aGUgRE9NIGJ5IHNlZWluZyB0aGF0IGl0cyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLlxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IFtleGl0LCBkaW1lbnNpb25zXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIC8vIFRoZSBzbmFja2JhciBjb250YWluZXIgaXMgbWFya2VkIHdpdGggdGhlIFwiZXhpdFwiIGF0dHJpYnV0ZSBhZnRlciBpdCBoYXMgYmVlbiBkaXNtaXNzZWRcbiAgICAgIC8vIGJ1dCBiZWZvcmUgdGhlIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQgKGFmdGVyIHdoaWNoIGl0J3MgcmVtb3ZlZCBmcm9tIHRoZSBET00pLlxuICAgICAgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1leGl0JyksXG4gICAgICBob3N0LmdldERpbWVuc2lvbnMoKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBleGl0ICE9IG51bGwgfHwgKCEhZGltZW5zaW9ucyAmJiBkaW1lbnNpb25zLmhlaWdodCA9PT0gMCAmJiBkaW1lbnNpb25zLndpZHRoID09PSAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGhhcyBhbiBhY3Rpb24gZGVmaW5lZC4gT3RoZXJ3aXNlIHRoZVxuICAgKiBwcm9taXNlIHdpbGwgcmVqZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBfYXNzZXJ0SGFzQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaGFzQWN0aW9uKCkpKSB7XG4gICAgICB0aHJvdyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBhIHNuYWNrLWJhciB3aXRob3V0IGFuIGFjdGlvbi4nKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2ltcGxlIHNuYWNrIGJhciBhY3Rpb24gYnV0dG9uLiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRBY3Rpb25CdXR0b24oKSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvck9wdGlvbmFsKHRoaXMuX2FjdGlvbkJ1dHRvblNlbGVjdG9yKSgpO1xuICB9XG59XG4iXX0=