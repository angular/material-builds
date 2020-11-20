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
        this._simpleSnackBar = this.locatorForOptional('.mat-simple-snackbar');
        this._simpleSnackBarLiveRegion = this.locatorFor('[aria-live]');
        this._simpleSnackBarMessage = this.locatorFor('.mat-simple-snackbar > span');
        this._simpleSnackBarActionButton = this.locatorForOptional('.mat-simple-snackbar-action > button');
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
            return (yield this._simpleSnackBarLiveRegion())
                .getAttribute('aria-live');
        });
    }
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    hasAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertSimpleSnackBar();
            return (yield this._simpleSnackBarActionButton()) !== null;
        });
    }
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    getActionDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertSimpleSnackBarWithAction();
            return (yield this._simpleSnackBarActionButton()).text();
        });
    }
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    dismissWithAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertSimpleSnackBarWithAction();
            yield (yield this._simpleSnackBarActionButton()).click();
        });
    }
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    getMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertSimpleSnackBar();
            return (yield this._simpleSnackBarMessage()).text();
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
     * Asserts that the current snack-bar does not use custom content. Promise rejects if
     * custom content is used.
     */
    _assertSimpleSnackBar() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._isSimpleSnackBar())) {
                throw Error('Method cannot be used for snack-bar with custom content.');
            }
        });
    }
    /**
     * Asserts that the current snack-bar does not use custom content and has
     * an action defined. Otherwise the promise will reject.
     */
    _assertSimpleSnackBarWithAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._assertSimpleSnackBar();
            if (!(yield this.hasAction())) {
                throw Error('Method cannot be used for standard snack-bar without action.');
            }
        });
    }
    /** Whether the snack-bar is using the default content template. */
    _isSimpleSnackBar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._simpleSnackBar()) !== null;
        });
    }
}
// Developers can provide a custom component or template for the
// snackbar. The canonical snack-bar parent is the "MatSnackBarContainer".
/** The selector for the host element of a `MatSnackBar` instance. */
MatSnackBarHarness.hostSelector = '.mat-snack-bar-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3Rlc3Rpbmcvc25hY2stYmFyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUdILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUdsRyxzRUFBc0U7QUFDdEUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdDQUF3QztJQUFoRjs7UUFNVSxvQkFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2xFLDhCQUF5QixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0QsMkJBQXNCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3hFLGdDQUEyQixHQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQTJHdEUsQ0FBQztJQXpHQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBa0MsRUFBRTtRQUM5QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0csT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFtQyxDQUFDO1FBQ3BGLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLFdBQVc7O1lBQ2YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7aUJBQzFDLFlBQVksQ0FBQyxXQUFXLENBQWdDLENBQUM7UUFDaEUsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxTQUFTOztZQUNiLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDbkMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7UUFDN0QsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csb0JBQW9COztZQUN4QixNQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUQsQ0FBQztLQUFBO0lBR0Q7OztPQUdHO0lBQ0csaUJBQWlCOztZQUNyQixNQUFNLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUQsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyxVQUFVOztZQUNkLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDbkMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFFRCxxREFBcUQ7SUFDL0MsV0FBVzs7WUFDZixvRkFBb0Y7WUFDcEYseUVBQXlFO1lBRXpFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzlDLHlGQUF5RjtnQkFDekYsaUZBQWlGO2dCQUNqRixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRTthQUNyQixDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0YsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ1cscUJBQXFCOztZQUNqQyxJQUFJLENBQUMsQ0FBQSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBLEVBQUU7Z0JBQ25DLE1BQU0sS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDekU7UUFDSCxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVywrQkFBK0I7O1lBQzNDLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUEsRUFBRTtnQkFDM0IsTUFBTSxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQzthQUM3RTtRQUNILENBQUM7S0FBQTtJQUVELG1FQUFtRTtJQUNyRCxpQkFBaUI7O1lBQzdCLE9BQU8sQ0FBQSxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBSyxJQUFJLENBQUM7UUFDL0MsQ0FBQztLQUFBOztBQW5IRCxnRUFBZ0U7QUFDaEUsMEVBQTBFO0FBQzFFLHFFQUFxRTtBQUM5RCwrQkFBWSxHQUFHLDBCQUEwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXJpYUxpdmVQb2xpdGVuZXNzfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTbmFja0Jhckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NuYWNrLWJhci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbmFjay1iYXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXJIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gY29tcG9uZW50IG9yIHRlbXBsYXRlIGZvciB0aGVcbiAgLy8gc25hY2tiYXIuIFRoZSBjYW5vbmljYWwgc25hY2stYmFyIHBhcmVudCBpcyB0aGUgXCJNYXRTbmFja0JhckNvbnRhaW5lclwiLlxuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFNuYWNrQmFyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNuYWNrLWJhci1jb250YWluZXInO1xuXG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc2ltcGxlLXNuYWNrYmFyJyk7XG4gIHByaXZhdGUgX3NpbXBsZVNuYWNrQmFyTGl2ZVJlZ2lvbiA9IHRoaXMubG9jYXRvckZvcignW2FyaWEtbGl2ZV0nKTtcbiAgcHJpdmF0ZSBfc2ltcGxlU25hY2tCYXJNZXNzYWdlID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNpbXBsZS1zbmFja2JhciA+IHNwYW4nKTtcbiAgcHJpdmF0ZSBfc2ltcGxlU25hY2tCYXJBY3Rpb25CdXR0b24gPVxuICAgICAgdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc2ltcGxlLXNuYWNrYmFyLWFjdGlvbiA+IGJ1dHRvbicpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTbmFja0Jhckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNuYWNrIGJhciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbmFja0Jhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNuYWNrQmFySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbmFja0Jhckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgb2YgdGhlIHNuYWNrLWJhci4gVGhlIHJvbGUgb2YgYSBzbmFjay1iYXIgaXMgZGV0ZXJtaW5lZCBiYXNlZFxuICAgKiBvbiB0aGUgQVJJQSBwb2xpdGVuZXNzIHNwZWNpZmllZCBpbiB0aGUgc25hY2stYmFyIGNvbmZpZy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRBcmlhTGl2ZWAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAgICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTwnYWxlcnQnfCdzdGF0dXMnfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSBhcyBQcm9taXNlPCdhbGVydCd8J3N0YXR1cyd8bnVsbD47XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYXJpYS1saXZlIG9mIHRoZSBzbmFjay1iYXIncyBsaXZlIHJlZ2lvbi4gVGhlIGFyaWEtbGl2ZSBvZiBhIHNuYWNrLWJhciBpc1xuICAgKiBkZXRlcm1pbmVkIGJhc2VkIG9uIHRoZSBBUklBIHBvbGl0ZW5lc3Mgc3BlY2lmaWVkIGluIHRoZSBzbmFjay1iYXIgY29uZmlnLlxuICAgKi9cbiAgYXN5bmMgZ2V0QXJpYUxpdmUoKTogUHJvbWlzZTxBcmlhTGl2ZVBvbGl0ZW5lc3M+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyTGl2ZVJlZ2lvbigpKVxuICAgICAgICAuZ2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnKSBhcyBQcm9taXNlPEFyaWFMaXZlUG9saXRlbmVzcz47XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBhbiBhY3Rpb24uIE1ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyJ3Mgd2l0aCBjdXN0b20gY29udGVudC5cbiAgICovXG4gIGFzeW5jIGhhc0FjdGlvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcigpO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXJBY3Rpb25CdXR0b24oKSkgIT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRob3V0IGFjdGlvbiBvclxuICAgKiB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0QWN0aW9uRGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcldpdGhBY3Rpb24oKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uKCkpIS50ZXh0KCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIHNuYWNrLWJhciBieSBjbGlja2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXInc1xuICAgKiB3aXRob3V0IGFjdGlvbiBvciB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZGlzbWlzc1dpdGhBY3Rpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fYXNzZXJ0U2ltcGxlU25hY2tCYXJXaXRoQWN0aW9uKCk7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuX3NpbXBsZVNuYWNrQmFyQWN0aW9uQnV0dG9uKCkpIS5jbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1lc3NhZ2Ugb2YgdGhlIHNuYWNrLWJhci4gTWV0aG9kIGNhbm5vdCBiZSB1c2VkIGZvciBzbmFjay1iYXIncyB3aXRoIGN1c3RvbSBjb250ZW50LlxuICAgKi9cbiAgYXN5bmMgZ2V0TWVzc2FnZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGF3YWl0IHRoaXMuX2Fzc2VydFNpbXBsZVNuYWNrQmFyKCk7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zaW1wbGVTbmFja0Jhck1lc3NhZ2UoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgc25hY2stYmFyIGhhcyBiZWVuIGRpc21pc3NlZC4gKi9cbiAgYXN5bmMgaXNEaXNtaXNzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIHNuYWNrYmFyIGRpc21pc3NlZCBpZiBpdCdzIG5vdCBpbiB0aGUgRE9NLiBXZSBjYW4gYXNzZXJ0IHRoYXQgdGhlXG4gICAgLy8gZWxlbWVudCBpc24ndCBpbiB0aGUgRE9NIGJ5IHNlZWluZyB0aGF0IGl0cyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLlxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IFtleGl0LCBkaW1lbnNpb25zXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIC8vIFRoZSBzbmFja2JhciBjb250YWluZXIgaXMgbWFya2VkIHdpdGggdGhlIFwiZXhpdFwiIGF0dHJpYnV0ZSBhZnRlciBpdCBoYXMgYmVlbiBkaXNtaXNzZWRcbiAgICAgIC8vIGJ1dCBiZWZvcmUgdGhlIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQgKGFmdGVyIHdoaWNoIGl0J3MgcmVtb3ZlZCBmcm9tIHRoZSBET00pLlxuICAgICAgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1leGl0JyksXG4gICAgICBob3N0LmdldERpbWVuc2lvbnMoKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBleGl0ICE9IG51bGwgfHwgKCEhZGltZW5zaW9ucyAmJiBkaW1lbnNpb25zLmhlaWdodCA9PT0gMCAmJiBkaW1lbnNpb25zLndpZHRoID09PSAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoYXQgdGhlIGN1cnJlbnQgc25hY2stYmFyIGRvZXMgbm90IHVzZSBjdXN0b20gY29udGVudC4gUHJvbWlzZSByZWplY3RzIGlmXG4gICAqIGN1c3RvbSBjb250ZW50IGlzIHVzZWQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9hc3NlcnRTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWF3YWl0IHRoaXMuX2lzU2ltcGxlU25hY2tCYXIoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc25hY2stYmFyIHdpdGggY3VzdG9tIGNvbnRlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgdGhhdCB0aGUgY3VycmVudCBzbmFjay1iYXIgZG9lcyBub3QgdXNlIGN1c3RvbSBjb250ZW50IGFuZCBoYXNcbiAgICogYW4gYWN0aW9uIGRlZmluZWQuIE90aGVyd2lzZSB0aGUgcHJvbWlzZSB3aWxsIHJlamVjdC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2Fzc2VydFNpbXBsZVNuYWNrQmFyV2l0aEFjdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hc3NlcnRTaW1wbGVTbmFja0JhcigpO1xuICAgIGlmICghYXdhaXQgdGhpcy5oYXNBY3Rpb24oKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ01ldGhvZCBjYW5ub3QgYmUgdXNlZCBmb3Igc3RhbmRhcmQgc25hY2stYmFyIHdpdGhvdXQgYWN0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjay1iYXIgaXMgdXNpbmcgdGhlIGRlZmF1bHQgY29udGVudCB0ZW1wbGF0ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfaXNTaW1wbGVTbmFja0JhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fc2ltcGxlU25hY2tCYXIoKSAhPT0gbnVsbDtcbiAgfVxufVxuIl19