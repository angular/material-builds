/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
/**
 * Event that is emitted when a snack bar is dismissed.
 * @record
 */
export function MatSnackBarDismiss() { }
if (false) {
    /**
     * Whether the snack bar was dismissed using the action button.
     * @type {?}
     */
    MatSnackBarDismiss.prototype.dismissedByAction;
}
/**
 * Reference to a snack bar dispatched from the snack bar service.
 * @template T
 */
export class MatSnackBarRef {
    /**
     * @param {?} containerInstance
     * @param {?} _overlayRef
     */
    constructor(containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /**
         * Subject for notifying the user that the snack bar has been dismissed.
         */
        this._afterDismissed = new Subject();
        /**
         * Subject for notifying the user that the snack bar has opened and appeared.
         */
        this._afterOpened = new Subject();
        /**
         * Subject for notifying the user that the snack bar action was called.
         */
        this._onAction = new Subject();
        /**
         * Whether the snack bar was dismissed using the action button.
         */
        this._dismissedByAction = false;
        this.containerInstance = containerInstance;
        // Dismiss snackbar on action.
        this.onAction().subscribe((/**
         * @return {?}
         */
        () => this.dismiss()));
        containerInstance._onExit.subscribe((/**
         * @return {?}
         */
        () => this._finishDismiss()));
    }
    /**
     * Dismisses the snack bar.
     * @return {?}
     */
    dismiss() {
        if (!this._afterDismissed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    }
    /**
     * Marks the snackbar action clicked.
     * @return {?}
     */
    dismissWithAction() {
        if (!this._onAction.closed) {
            this._dismissedByAction = true;
            this._onAction.next();
            this._onAction.complete();
        }
    }
    /**
     * Marks the snackbar action clicked.
     * @deprecated Use `dismissWithAction` instead.
     * \@breaking-change 8.0.0
     * @return {?}
     */
    closeWithAction() {
        this.dismissWithAction();
    }
    /**
     * Dismisses the snack bar after some duration
     * @param {?} duration
     * @return {?}
     */
    _dismissAfter(duration) {
        this._durationTimeoutId = setTimeout((/**
         * @return {?}
         */
        () => this.dismiss()), duration);
    }
    /**
     * Marks the snackbar as opened
     * @return {?}
     */
    _open() {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    }
    /**
     * Cleans up the DOM after closing.
     * @private
     * @return {?}
     */
    _finishDismiss() {
        this._overlayRef.dispose();
        if (!this._onAction.closed) {
            this._onAction.complete();
        }
        this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
        this._afterDismissed.complete();
        this._dismissedByAction = false;
    }
    /**
     * Gets an observable that is notified when the snack bar is finished closing.
     * @return {?}
     */
    afterDismissed() {
        return this._afterDismissed.asObservable();
    }
    /**
     * Gets an observable that is notified when the snack bar has opened and appeared.
     * @return {?}
     */
    afterOpened() {
        return this.containerInstance._onEnter;
    }
    /**
     * Gets an observable that is notified when the snack bar action is called.
     * @return {?}
     */
    onAction() {
        return this._onAction.asObservable();
    }
}
if (false) {
    /**
     * The instance of the component making up the content of the snack bar.
     * @type {?}
     */
    MatSnackBarRef.prototype.instance;
    /**
     * The instance of the component making up the content of the snack bar.
     * \@docs-private
     * @type {?}
     */
    MatSnackBarRef.prototype.containerInstance;
    /**
     * Subject for notifying the user that the snack bar has been dismissed.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._afterDismissed;
    /**
     * Subject for notifying the user that the snack bar has opened and appeared.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._afterOpened;
    /**
     * Subject for notifying the user that the snack bar action was called.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._onAction;
    /**
     * Timeout ID for the duration setTimeout call. Used to clear the timeout if the snackbar is
     * dismissed before the duration passes.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._durationTimeoutId;
    /**
     * Whether the snack bar was dismissed using the action button.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._dismissedByAction;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._overlayRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVNBLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBS3pDLHdDQUdDOzs7Ozs7SUFEQywrQ0FBMkI7Ozs7OztBQU03QixNQUFNLE9BQU8sY0FBYzs7Ozs7SUE0QnpCLFlBQVksaUJBQXVDLEVBQy9CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZOzs7O1FBbEIxQixvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFzQixDQUFDOzs7O1FBR3BELGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7OztRQUduQyxjQUFTLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7OztRQVN6Qyx1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFJakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUM7UUFDaEQsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBQyxDQUFDO0lBQ25FLENBQUM7Ozs7O0lBR0QsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtZQUNoQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7UUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDeEMsQ0FBQzs7Ozs7SUFHRCxpQkFBaUI7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDOzs7Ozs7O0lBUUQsZUFBZTtRQUNiLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7OztJQUdELGFBQWEsQ0FBQyxRQUFnQjtRQUM1QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVTs7O1FBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7Ozs7O0lBR0QsS0FBSztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDOzs7Ozs7SUFHTyxjQUFjO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7Ozs7O0lBR0QsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM3QyxDQUFDOzs7OztJQUdELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFDekMsQ0FBQzs7Ozs7SUFHRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjs7Ozs7O0lBckdDLGtDQUFZOzs7Ozs7SUFNWiwyQ0FBd0M7Ozs7OztJQUd4Qyx5Q0FBcUU7Ozs7OztJQUdyRSxzQ0FBb0Q7Ozs7OztJQUdwRCxtQ0FBaUQ7Ozs7Ozs7SUFNakQsNENBQW1DOzs7Ozs7SUFHbkMsNENBQW1DOzs7OztJQUd2QixxQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTbmFja0JhckNvbnRhaW5lcn0gZnJvbSAnLi9zbmFjay1iYXItY29udGFpbmVyJztcblxuXG4vKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYSBzbmFjayBiYXIgaXMgZGlzbWlzc2VkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTbmFja0JhckRpc21pc3Mge1xuICAvKiogV2hldGhlciB0aGUgc25hY2sgYmFyIHdhcyBkaXNtaXNzZWQgdXNpbmcgdGhlIGFjdGlvbiBidXR0b24uICovXG4gIGRpc21pc3NlZEJ5QWN0aW9uOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHNuYWNrIGJhciBkaXNwYXRjaGVkIGZyb20gdGhlIHNuYWNrIGJhciBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXJSZWY8VD4ge1xuICAvKiogVGhlIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgbWFraW5nIHVwIHRoZSBjb250ZW50IG9mIHRoZSBzbmFjayBiYXIuICovXG4gIGluc3RhbmNlOiBUO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIHNuYWNrIGJhci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29udGFpbmVySW5zdGFuY2U6IE1hdFNuYWNrQmFyQ29udGFpbmVyO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBiZWVuIGRpc21pc3NlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJEaXNtaXNzZWQgPSBuZXcgU3ViamVjdDxNYXRTbmFja0JhckRpc21pc3M+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIHNuYWNrIGJhciBhY3Rpb24gd2FzIGNhbGxlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25BY3Rpb24gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IElEIGZvciB0aGUgZHVyYXRpb24gc2V0VGltZW91dCBjYWxsLiBVc2VkIHRvIGNsZWFyIHRoZSB0aW1lb3V0IGlmIHRoZSBzbmFja2JhciBpc1xuICAgKiBkaXNtaXNzZWQgYmVmb3JlIHRoZSBkdXJhdGlvbiBwYXNzZXMuXG4gICAqL1xuICBwcml2YXRlIF9kdXJhdGlvblRpbWVvdXRJZDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjayBiYXIgd2FzIGRpc21pc3NlZCB1c2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gKi9cbiAgcHJpdmF0ZSBfZGlzbWlzc2VkQnlBY3Rpb24gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihjb250YWluZXJJbnN0YW5jZTogTWF0U25hY2tCYXJDb250YWluZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYpIHtcbiAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlID0gY29udGFpbmVySW5zdGFuY2U7XG4gICAgLy8gRGlzbWlzcyBzbmFja2JhciBvbiBhY3Rpb24uXG4gICAgdGhpcy5vbkFjdGlvbigpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmRpc21pc3MoKSk7XG4gICAgY29udGFpbmVySW5zdGFuY2UuX29uRXhpdC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZmluaXNoRGlzbWlzcygpKTtcbiAgfVxuXG4gIC8qKiBEaXNtaXNzZXMgdGhlIHNuYWNrIGJhci4gKi9cbiAgZGlzbWlzcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2FmdGVyRGlzbWlzc2VkLmNsb3NlZCkge1xuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5leGl0KCk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kdXJhdGlvblRpbWVvdXRJZCk7XG4gIH1cblxuICAvKiogTWFya3MgdGhlIHNuYWNrYmFyIGFjdGlvbiBjbGlja2VkLiAqL1xuICBkaXNtaXNzV2l0aEFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX29uQWN0aW9uLmNsb3NlZCkge1xuICAgICAgdGhpcy5fZGlzbWlzc2VkQnlBY3Rpb24gPSB0cnVlO1xuICAgICAgdGhpcy5fb25BY3Rpb24ubmV4dCgpO1xuICAgICAgdGhpcy5fb25BY3Rpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgc25hY2tiYXIgYWN0aW9uIGNsaWNrZWQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZGlzbWlzc1dpdGhBY3Rpb25gIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGNsb3NlV2l0aEFjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLmRpc21pc3NXaXRoQWN0aW9uKCk7XG4gIH1cblxuICAvKiogRGlzbWlzc2VzIHRoZSBzbmFjayBiYXIgYWZ0ZXIgc29tZSBkdXJhdGlvbiAqL1xuICBfZGlzbWlzc0FmdGVyKGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9kdXJhdGlvblRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kaXNtaXNzKCksIGR1cmF0aW9uKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyB0aGUgc25hY2tiYXIgYXMgb3BlbmVkICovXG4gIF9vcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fYWZ0ZXJPcGVuZWQuY2xvc2VkKSB7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5uZXh0KCk7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhbnMgdXAgdGhlIERPTSBhZnRlciBjbG9zaW5nLiAqL1xuICBwcml2YXRlIF9maW5pc2hEaXNtaXNzKCk6IHZvaWQge1xuICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuXG4gICAgaWYgKCF0aGlzLl9vbkFjdGlvbi5jbG9zZWQpIHtcbiAgICAgIHRoaXMuX29uQWN0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQubmV4dCh7ZGlzbWlzc2VkQnlBY3Rpb246IHRoaXMuX2Rpc21pc3NlZEJ5QWN0aW9ufSk7XG4gICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kaXNtaXNzZWRCeUFjdGlvbiA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHNuYWNrIGJhciBpcyBmaW5pc2hlZCBjbG9zaW5nLiAqL1xuICBhZnRlckRpc21pc3NlZCgpOiBPYnNlcnZhYmxlPE1hdFNuYWNrQmFyRGlzbWlzcz4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlckRpc21pc3NlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzbmFjayBiYXIgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXG4gIGFmdGVyT3BlbmVkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lckluc3RhbmNlLl9vbkVudGVyO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHNuYWNrIGJhciBhY3Rpb24gaXMgY2FsbGVkLiAqL1xuICBvbkFjdGlvbigpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb25BY3Rpb24uYXNPYnNlcnZhYmxlKCk7XG4gIH1cbn1cbiJdfQ==