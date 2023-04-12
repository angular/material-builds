/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
export class _MatSnackBarHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._snackBarLiveRegion = this.locatorFor('[aria-live]');
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
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    async _assertHasAction() {
        await this._assertContentAnnotated();
        if (!(await this.hasAction())) {
            throw Error('Method cannot be used for a snack-bar without an action.');
        }
    }
    /** Gets the simple snack bar action button. */
    async _getActionButton() {
        return this.locatorForOptional(this._actionButtonSelector)();
    }
}
/** Harness for interacting with an MDC-based mat-snack-bar in tests. */
class MatSnackBarHarness extends _MatSnackBarHarnessBase {
    constructor() {
        super(...arguments);
        this._messageSelector = '.mdc-snackbar__label';
        this._actionButtonSelector = '.mat-mdc-snack-bar-action';
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
     * Asserts that the current snack-bar has annotated content. Promise reject
     * if content is not annotated.
     */
    async _assertContentAnnotated() { }
}
export { MatSnackBarHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBSWxHLE1BQU0sT0FBZ0IsdUJBQXdCLFNBQVEsZ0NBQXdDO0lBQTlGOztRQUlVLHdCQUFtQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUE2Ri9ELENBQUM7SUEzRkM7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQXVDLENBQUM7SUFDeEYsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXO1FBQ2YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQ3BELFdBQVcsQ0FDbUIsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsU0FBUztRQUNiLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxvQkFBb0I7UUFDeEIsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsaUJBQWlCO1FBQ3JCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakUsQ0FBQztJQUVELHFEQUFxRDtJQUNyRCxLQUFLLENBQUMsV0FBVztRQUNmLG9GQUFvRjtRQUNwRix5RUFBeUU7UUFFekUsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM5Qyx5RkFBeUY7WUFDekYsaUZBQWlGO1lBQ2pGLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxhQUFhLEVBQUU7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFRRDs7O09BR0c7SUFDTyxLQUFLLENBQUMsZ0JBQWdCO1FBQzlCLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRTtZQUM3QixNQUFNLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELCtDQUErQztJQUN2QyxLQUFLLENBQUMsZ0JBQWdCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUM7SUFDL0QsQ0FBQztDQUNGO0FBRUQsd0VBQXdFO0FBQ3hFLE1BQWEsa0JBQW1CLFNBQVEsdUJBQXVCO0lBQS9EOztRQUtxQixxQkFBZ0IsR0FBRyxzQkFBc0IsQ0FBQztRQUMxQywwQkFBcUIsR0FBRywyQkFBMkIsQ0FBQztJQWlCekUsQ0FBQztJQXRCQyxnRUFBZ0U7SUFDaEUsMEVBQTBFO0lBQzFFLHFFQUFxRTthQUM5RCxpQkFBWSxHQUFHLDhDQUE4QyxBQUFqRCxDQUFrRDtJQUlyRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBa0MsRUFBRTtRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7T0FHRztJQUNnQixLQUFLLENBQUMsdUJBQXVCLEtBQUksQ0FBQzs7U0F0QjFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtBcmlhTGl2ZVBvbGl0ZW5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7U25hY2tCYXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9zbmFjay1iYXItaGFybmVzcy1maWx0ZXJzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRTbmFja0Jhckhhcm5lc3NCYXNlIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfbWVzc2FnZVNlbGVjdG9yOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYWN0aW9uQnV0dG9uU2VsZWN0b3I6IHN0cmluZztcblxuICBwcml2YXRlIF9zbmFja0JhckxpdmVSZWdpb24gPSB0aGlzLmxvY2F0b3JGb3IoJ1thcmlhLWxpdmVdJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgb2YgdGhlIHNuYWNrLWJhci4gVGhlIHJvbGUgb2YgYSBzbmFjay1iYXIgaXMgZGV0ZXJtaW5lZCBiYXNlZFxuICAgKiBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRBcmlhTGl2ZWAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTwnYWxlcnQnIHwgJ3N0YXR1cycgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTwnYWxlcnQnIHwgJ3N0YXR1cycgfCBudWxsPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhcmlhLWxpdmUgb2YgdGhlIHNuYWNrLWJhcidzIGxpdmUgcmVnaW9uLiBUaGUgYXJpYS1saXZlIG9mIGEgc25hY2stYmFyIGlzXG4gICAqIGRldGVybWluZWQgYmFzZWQgb24gdGhlIEFSSUEgcG9saXRlbmVzcyBzcGVjaWZpZWQgaW4gdGhlIHNuYWNrLWJhciBjb25maWcuXG4gICAqL1xuICBhc3luYyBnZXRBcmlhTGl2ZSgpOiBQcm9taXNlPEFyaWFMaXZlUG9saXRlbmVzcz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc25hY2tCYXJMaXZlUmVnaW9uKCkpLmdldEF0dHJpYnV0ZShcbiAgICAgICdhcmlhLWxpdmUnLFxuICAgICkgYXMgUHJvbWlzZTxBcmlhTGl2ZVBvbGl0ZW5lc3M+O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBoYXNBY3Rpb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0Q29udGVudEFubm90YXRlZCgpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZ2V0QWN0aW9uQnV0dG9uKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3JcbiAgICogd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldEFjdGlvbkRlc2NyaXB0aW9uKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0SGFzQWN0aW9uKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRBY3Rpb25CdXR0b24oKSkhLnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIHNuYWNrLWJhciBieSBjbGlja2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXInc1xuICAgKiB3aXRob3V0IGFjdGlvbiBvciB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZGlzbWlzc1dpdGhBY3Rpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0SGFzQWN0aW9uKCk7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuX2dldEFjdGlvbkJ1dHRvbigpKSEuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtZXNzYWdlIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldE1lc3NhZ2UoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3IodGhpcy5fbWVzc2FnZVNlbGVjdG9yKSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBzbmFjay1iYXIgaGFzIGJlZW4gZGlzbWlzc2VkLiAqL1xuICBhc3luYyBpc0Rpc21pc3NlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBXZSBjb25zaWRlciB0aGUgc25hY2tiYXIgZGlzbWlzc2VkIGlmIGl0J3Mgbm90IGluIHRoZSBET00uIFdlIGNhbiBhc3NlcnQgdGhhdCB0aGVcbiAgICAvLyBlbGVtZW50IGlzbid0IGluIHRoZSBET00gYnkgc2VlaW5nIHRoYXQgaXRzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8uXG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2V4aXQsIGRpbWVuc2lvbnNdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW1xuICAgICAgLy8gVGhlIHNuYWNrYmFyIGNvbnRhaW5lciBpcyBtYXJrZWQgd2l0aCB0aGUgXCJleGl0XCIgYXR0cmlidXRlIGFmdGVyIGl0IGhhcyBiZWVuIGRpc21pc3NlZFxuICAgICAgLy8gYnV0IGJlZm9yZSB0aGUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCAoYWZ0ZXIgd2hpY2ggaXQncyByZW1vdmVkIGZyb20gdGhlIERPTSkuXG4gICAgICBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LWV4aXQnKSxcbiAgICAgIGhvc3QuZ2V0RGltZW5zaW9ucygpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGV4aXQgIT0gbnVsbCB8fCAoISFkaW1lbnNpb25zICYmIGRpbWVuc2lvbnMuaGVpZ2h0ID09PSAwICYmIGRpbWVuc2lvbnMud2lkdGggPT09IDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgdGhhdCB0aGUgY3VycmVudCBzbmFjay1iYXIgaGFzIGFubm90YXRlZCBjb250ZW50LiBQcm9taXNlIHJlamVjdFxuICAgKiBpZiBjb250ZW50IGlzIG5vdCBhbm5vdGF0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2Fzc2VydENvbnRlbnRBbm5vdGF0ZWQoKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogQXNzZXJ0cyB0aGF0IHRoZSBjdXJyZW50IHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uIGRlZmluZWQuIE90aGVyd2lzZSB0aGVcbiAgICogcHJvbWlzZSB3aWxsIHJlamVjdC5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBfYXNzZXJ0SGFzQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydENvbnRlbnRBbm5vdGF0ZWQoKTtcbiAgICBpZiAoIShhd2FpdCB0aGlzLmhhc0FjdGlvbigpKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3IgYSBzbmFjay1iYXIgd2l0aG91dCBhbiBhY3Rpb24uJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNpbXBsZSBzbmFjayBiYXIgYWN0aW9uIGJ1dHRvbi4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0QWN0aW9uQnV0dG9uKCkge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCh0aGlzLl9hY3Rpb25CdXR0b25TZWxlY3RvcikoKTtcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhbiBNREMtYmFzZWQgbWF0LXNuYWNrLWJhciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhckhhcm5lc3MgZXh0ZW5kcyBfTWF0U25hY2tCYXJIYXJuZXNzQmFzZSB7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gY29tcG9uZW50IG9yIHRlbXBsYXRlIGZvciB0aGVcbiAgLy8gc25hY2tiYXIuIFRoZSBjYW5vbmljYWwgc25hY2stYmFyIHBhcmVudCBpcyB0aGUgXCJNYXRTbmFja0JhckNvbnRhaW5lclwiLlxuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFNuYWNrQmFyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1kYy1zbmFjay1iYXItY29udGFpbmVyOm5vdChbbWF0LWV4aXRdKSc7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBfbWVzc2FnZVNlbGVjdG9yID0gJy5tZGMtc25hY2tiYXJfX2xhYmVsJztcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9hY3Rpb25CdXR0b25TZWxlY3RvciA9ICcubWF0LW1kYy1zbmFjay1iYXItYWN0aW9uJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U25hY2tCYXJIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzbmFjayBiYXIgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU25hY2tCYXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTbmFja0Jhckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U25hY2tCYXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGhhcyBhbm5vdGF0ZWQgY29udGVudC4gUHJvbWlzZSByZWplY3RcbiAgICogaWYgY29udGVudCBpcyBub3QgYW5ub3RhdGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGFzeW5jIF9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCkge31cbn1cbiJdfQ==