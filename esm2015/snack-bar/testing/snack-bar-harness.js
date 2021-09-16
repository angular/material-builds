/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
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
    getRole() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('role');
        });
    }
    /**
     * Gets the aria-live of the snack-bar's live region. The aria-live of a snack-bar is
     * determined based on the ARIA politeness specified in the snack-bar config.
     */
    getAriaLive() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._snackBarLiveRegion())
                .getAttribute('aria-live');
        });
    }
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    hasAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertContentAnnotated();
            return (yield this._getActionButton()) !== null;
        });
    }
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    getActionDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertHasAction();
            return (yield this._getActionButton()).text();
        });
    }
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    dismissWithAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertHasAction();
            yield (yield this._getActionButton()).click();
        });
    }
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    getMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertContentAnnotated();
            return (yield this.locatorFor(this._messageSelector)()).text();
        });
    }
    /** Gets whether the snack-bar has been dismissed. */
    isDismissed() {
        return __awaiter(this, void 0, void 0, function* () {
            // We consider the snackbar dismissed if it's not in the DOM. We can assert that the
            // element isn't in the DOM by seeing that its width and height are zero.
            const host = yield this.host();
            const [exit, dimensions] = yield parallel(() => [
                // The snackbar container is marked with the "exit" attribute after it has been dismissed
                // but before the animation has finished (after which it's removed from the DOM).
                host.getAttribute('mat-exit'),
                host.getDimensions(),
            ]);
            return exit != null || (!!dimensions && dimensions.height === 0 && dimensions.width === 0);
        });
    }
    /**
     * Asserts that the current snack-bar has annotated content. Promise reject
     * if content is not annotated.
     */
    _assertContentAnnotated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._isSimpleSnackBar())) {
                throw Error('Method cannot be used for snack-bar with custom content.');
            }
        });
    }
    /**
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    _assertHasAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertContentAnnotated();
            if (!(yield this.hasAction())) {
                throw Error('Method cannot be used for a snack-bar without an action.');
            }
        });
    }
    /** Whether the snack-bar is using the default content template. */
    _isSimpleSnackBar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorForOptional('.mat-simple-snackbar')()) !== null;
        });
    }
    /** Gets the simple snack bar action button. */
    _getActionButton() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForOptional(this._actionButtonSelector)();
        });
    }
}
// Developers can provide a custom component or template for the
// snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
/** The selector for the host element of a `MatSnackBar` instance. */
MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUdILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUdsRyxzRUFBc0U7QUFDdEUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdDQUF3QztJQUFoRjs7UUFLWSxxQkFBZ0IsR0FBRyw2QkFBNkIsQ0FBQztRQUNqRCwwQkFBcUIsR0FBRyxzQ0FBc0MsQ0FBQztRQUNqRSx3QkFBbUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBZ0gvRCxDQUFDO0lBOUdDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDRyxPQUFPOztZQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQW1DLENBQUM7UUFDcEYsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csV0FBVzs7WUFDZixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztpQkFDcEMsWUFBWSxDQUFDLFdBQVcsQ0FBZ0MsQ0FBQztRQUNoRSxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLFNBQVM7O1lBQ2IsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxvQkFBb0I7O1lBQ3hCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDOUIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRCxDQUFDO0tBQUE7SUFHRDs7O09BR0c7SUFDRyxpQkFBaUI7O1lBQ3JCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDOUIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLFVBQVU7O1lBQ2QsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRSxDQUFDO0tBQUE7SUFFRCxxREFBcUQ7SUFDL0MsV0FBVzs7WUFDZixvRkFBb0Y7WUFDcEYseUVBQXlFO1lBRXpFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzlDLHlGQUF5RjtnQkFDekYsaUZBQWlGO2dCQUNqRixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRTthQUNyQixDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0YsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ2EsdUJBQXVCOztZQUNyQyxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBLEVBQUU7Z0JBQ25DLE1BQU0sS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDekU7UUFDSCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDYSxnQkFBZ0I7O1lBQzlCLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUEsRUFBRTtnQkFDM0IsTUFBTSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQzthQUN6RTtRQUNILENBQUM7S0FBQTtJQUVELG1FQUFtRTtJQUNyRCxpQkFBaUI7O1lBQzdCLE9BQU8sQ0FBQSxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLE1BQUssSUFBSSxDQUFDO1FBQzFFLENBQUM7S0FBQTtJQUVELCtDQUErQztJQUNqQyxnQkFBZ0I7O1lBQzVCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUM7UUFDL0QsQ0FBQztLQUFBOztBQXJIRCxnRUFBZ0U7QUFDaEUsMEVBQTBFO0FBQzFFLHFFQUFxRTtBQUM5RCwrQkFBWSxHQUFHLDBCQUEwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXJpYUxpdmVQb2xpdGVuZXNzfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTbmFja0Jhckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NuYWNrLWJhci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbmFjay1iYXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXJIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gY29tcG9uZW50IG9yIHRlbXBsYXRlIGZvciB0aGVcbiAgLy8gc25hY2tiYXIuIFRoZSBjYW5vbmljYWwgc25hY2stYmFyIHBhcmVudCBpcyB0aGUgXCJNYXRTbmFja0JhckNvbnRhaW5lclwiLlxuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFNuYWNrQmFyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNuYWNrLWJhci1jb250YWluZXInO1xuICBwcm90ZWN0ZWQgX21lc3NhZ2VTZWxlY3RvciA9ICcubWF0LXNpbXBsZS1zbmFja2JhciA+IHNwYW4nO1xuICBwcm90ZWN0ZWQgX2FjdGlvbkJ1dHRvblNlbGVjdG9yID0gJy5tYXQtc2ltcGxlLXNuYWNrYmFyLWFjdGlvbiA+IGJ1dHRvbic7XG4gIHByaXZhdGUgX3NuYWNrQmFyTGl2ZVJlZ2lvbiA9IHRoaXMubG9jYXRvckZvcignW2FyaWEtbGl2ZV0nKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U25hY2tCYXJIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzbmFjayBiYXIgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU25hY2tCYXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTbmFja0Jhckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U25hY2tCYXJIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb2xlIG9mIHRoZSBzbmFjay1iYXIuIFRoZSByb2xlIG9mIGEgc25hY2stYmFyIGlzIGRldGVybWluZWQgYmFzZWRcbiAgICogb24gdGhlIEFSSUEgcG9saXRlbmVzcyBzcGVjaWZpZWQgaW4gdGhlIHNuYWNrLWJhciBjb25maWcuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZ2V0QXJpYUxpdmVgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wXG4gICAqL1xuICBhc3luYyBnZXRSb2xlKCk6IFByb21pc2U8J2FsZXJ0J3wnc3RhdHVzJ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTwnYWxlcnQnfCdzdGF0dXMnfG51bGw+O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGFyaWEtbGl2ZSBvZiB0aGUgc25hY2stYmFyJ3MgbGl2ZSByZWdpb24uIFRoZSBhcmlhLWxpdmUgb2YgYSBzbmFjay1iYXIgaXNcbiAgICogZGV0ZXJtaW5lZCBiYXNlZCBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICovXG4gIGFzeW5jIGdldEFyaWFMaXZlKCk6IFByb21pc2U8QXJpYUxpdmVQb2xpdGVuZXNzPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zbmFja0JhckxpdmVSZWdpb24oKSlcbiAgICAgICAgLmdldEF0dHJpYnV0ZSgnYXJpYS1saXZlJykgYXMgUHJvbWlzZTxBcmlhTGl2ZVBvbGl0ZW5lc3M+O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYW4gYWN0aW9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBoYXNBY3Rpb24oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0Q29udGVudEFubm90YXRlZCgpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZ2V0QWN0aW9uQnV0dG9uKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBzbmFjay1iYXIuIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aG91dCBhY3Rpb24gb3JcbiAgICogd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGdldEFjdGlvbkRlc2NyaXB0aW9uKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0SGFzQWN0aW9uKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRBY3Rpb25CdXR0b24oKSkhLnRleHQoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgc25hY2stYmFyIGJ5IGNsaWNraW5nIHRoZSBhY3Rpb24gYnV0dG9uLiBNZXRob2QgY2Fubm90IGJlIHVzZWQgZm9yIHNuYWNrLWJhcidzXG4gICAqIHdpdGhvdXQgYWN0aW9uIG9yIHdpdGggY3VzdG9tIGNvbnRlbnQuXG4gICAqL1xuICBhc3luYyBkaXNtaXNzV2l0aEFjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRIYXNBY3Rpb24oKTtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5fZ2V0QWN0aW9uQnV0dG9uKCkpIS5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1lc3NhZ2Ugb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0TWVzc2FnZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydENvbnRlbnRBbm5vdGF0ZWQoKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubG9jYXRvckZvcih0aGlzLl9tZXNzYWdlU2VsZWN0b3IpKCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNuYWNrLWJhciBoYXMgYmVlbiBkaXNtaXNzZWQuICovXG4gIGFzeW5jIGlzRGlzbWlzc2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIFdlIGNvbnNpZGVyIHRoZSBzbmFja2JhciBkaXNtaXNzZWQgaWYgaXQncyBub3QgaW4gdGhlIERPTS4gV2UgY2FuIGFzc2VydCB0aGF0IHRoZVxuICAgIC8vIGVsZW1lbnQgaXNuJ3QgaW4gdGhlIERPTSBieSBzZWVpbmcgdGhhdCBpdHMgd2lkdGggYW5kIGhlaWdodCBhcmUgemVyby5cblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBbZXhpdCwgZGltZW5zaW9uc10gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICAvLyBUaGUgc25hY2tiYXIgY29udGFpbmVyIGlzIG1hcmtlZCB3aXRoIHRoZSBcImV4aXRcIiBhdHRyaWJ1dGUgYWZ0ZXIgaXQgaGFzIGJlZW4gZGlzbWlzc2VkXG4gICAgICAvLyBidXQgYmVmb3JlIHRoZSBhbmltYXRpb24gaGFzIGZpbmlzaGVkIChhZnRlciB3aGljaCBpdCdzIHJlbW92ZWQgZnJvbSB0aGUgRE9NKS5cbiAgICAgIGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtZXhpdCcpLFxuICAgICAgaG9zdC5nZXREaW1lbnNpb25zKCksXG4gICAgXSk7XG5cbiAgICByZXR1cm4gZXhpdCAhPSBudWxsIHx8ICghIWRpbWVuc2lvbnMgJiYgZGltZW5zaW9ucy5oZWlnaHQgPT09IDAgJiYgZGltZW5zaW9ucy53aWR0aCA9PT0gMCk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0cyB0aGF0IHRoZSBjdXJyZW50IHNuYWNrLWJhciBoYXMgYW5ub3RhdGVkIGNvbnRlbnQuIFByb21pc2UgcmVqZWN0XG4gICAqIGlmIGNvbnRlbnQgaXMgbm90IGFubm90YXRlZC5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBfYXNzZXJ0Q29udGVudEFubm90YXRlZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2lzU2ltcGxlU25hY2tCYXIoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyIHdpdGggY3VzdG9tIGNvbnRlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgdGhhdCB0aGUgY3VycmVudCBzbmFjay1iYXIgaGFzIGFuIGFjdGlvbiBkZWZpbmVkLiBPdGhlcndpc2UgdGhlXG4gICAqIHByb21pc2Ugd2lsbCByZWplY3QuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgX2Fzc2VydEhhc0FjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRDb250ZW50QW5ub3RhdGVkKCk7XG4gICAgaWYgKCFhd2FpdCB0aGlzLmhhc0FjdGlvbigpKSB7XG4gICAgICB0aHJvdyBFcnJvcignTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBhIHNuYWNrLWJhciB3aXRob3V0IGFuIGFjdGlvbi4nKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc25hY2stYmFyIGlzIHVzaW5nIHRoZSBkZWZhdWx0IGNvbnRlbnQgdGVtcGxhdGUuICovXG4gIHByaXZhdGUgYXN5bmMgX2lzU2ltcGxlU25hY2tCYXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXNpbXBsZS1zbmFja2JhcicpKCkgIT09IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2ltcGxlIHNuYWNrIGJhciBhY3Rpb24gYnV0dG9uLiAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRBY3Rpb25CdXR0b24oKSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvck9wdGlvbmFsKHRoaXMuX2FjdGlvbkJ1dHRvblNlbGVjdG9yKSgpO1xuICB9XG59XG4iXX0=