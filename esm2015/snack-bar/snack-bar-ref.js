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
 * Maximum amount of milliseconds that can be passed into setTimeout.
 * @type {?}
 */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;
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
        // Note that we need to cap the duration to the maximum value for setTimeout, because
        // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
        this._durationTimeoutId = setTimeout((/**
         * @return {?}
         */
        () => this.dismiss()), Math.min(duration, MAX_TIMEOUT));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVNBLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBS3pDLHdDQUdDOzs7Ozs7SUFEQywrQ0FBMkI7Ozs7OztNQUl2QixXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQzs7Ozs7QUFLdkMsTUFBTSxPQUFPLGNBQWM7Ozs7O0lBNEJ6QixZQUFZLGlCQUF1QyxFQUMvQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTs7OztRQWxCMUIsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBc0IsQ0FBQzs7OztRQUdwRCxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7Ozs7UUFHbkMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7Ozs7UUFTekMsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBSWpDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDO1FBQ2hELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUMsQ0FBQztJQUNuRSxDQUFDOzs7OztJQUdELE9BQU87UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO1NBQy9CO1FBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Ozs7O0lBR0QsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7Ozs7OztJQVFELGVBQWU7UUFDYixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7Ozs7SUFHRCxhQUFhLENBQUMsUUFBZ0I7UUFDNUIscUZBQXFGO1FBQ3JGLDJGQUEyRjtRQUMzRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVTs7O1FBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQzs7Ozs7SUFHRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM5QjtJQUNILENBQUM7Ozs7OztJQUdPLGNBQWM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUMzQjtRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQzs7Ozs7SUFHRCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7Ozs7O0lBR0QsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztJQUN6QyxDQUFDOzs7OztJQUdELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkMsQ0FBQztDQUNGOzs7Ozs7SUF2R0Msa0NBQVk7Ozs7OztJQU1aLDJDQUF3Qzs7Ozs7O0lBR3hDLHlDQUFxRTs7Ozs7O0lBR3JFLHNDQUFvRDs7Ozs7O0lBR3BELG1DQUFpRDs7Ozs7OztJQU1qRCw0Q0FBbUM7Ozs7OztJQUduQyw0Q0FBbUM7Ozs7O0lBR3ZCLHFDQUErQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29udGFpbmVyfSBmcm9tICcuL3NuYWNrLWJhci1jb250YWluZXInO1xuXG5cbi8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBhIHNuYWNrIGJhciBpcyBkaXNtaXNzZWQuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNuYWNrQmFyRGlzbWlzcyB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjayBiYXIgd2FzIGRpc21pc3NlZCB1c2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gKi9cbiAgZGlzbWlzc2VkQnlBY3Rpb246IGJvb2xlYW47XG59XG5cbi8qKiBNYXhpbXVtIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdGhhdCBjYW4gYmUgcGFzc2VkIGludG8gc2V0VGltZW91dC4gKi9cbmNvbnN0IE1BWF9USU1FT1VUID0gTWF0aC5wb3coMiwgMzEpIC0gMTtcblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSBzbmFjayBiYXIgZGlzcGF0Y2hlZCBmcm9tIHRoZSBzbmFjayBiYXIgc2VydmljZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNuYWNrQmFyUmVmPFQ+IHtcbiAgLyoqIFRoZSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IG1ha2luZyB1cCB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyLiAqL1xuICBpbnN0YW5jZTogVDtcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgbWFraW5nIHVwIHRoZSBjb250ZW50IG9mIHRoZSBzbmFjayBiYXIuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbnRhaW5lckluc3RhbmNlOiBNYXRTbmFja0JhckNvbnRhaW5lcjtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIHNuYWNrIGJhciBoYXMgYmVlbiBkaXNtaXNzZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyRGlzbWlzc2VkID0gbmV3IFN1YmplY3Q8TWF0U25hY2tCYXJEaXNtaXNzPigpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBvcGVuZWQgYW5kIGFwcGVhcmVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBzbmFjayBiYXIgYWN0aW9uIHdhcyBjYWxsZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX29uQWN0aW9uID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGltZW91dCBJRCBmb3IgdGhlIGR1cmF0aW9uIHNldFRpbWVvdXQgY2FsbC4gVXNlZCB0byBjbGVhciB0aGUgdGltZW91dCBpZiB0aGUgc25hY2tiYXIgaXNcbiAgICogZGlzbWlzc2VkIGJlZm9yZSB0aGUgZHVyYXRpb24gcGFzc2VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZHVyYXRpb25UaW1lb3V0SWQ6IG51bWJlcjtcblxuICAvKiogV2hldGhlciB0aGUgc25hY2sgYmFyIHdhcyBkaXNtaXNzZWQgdXNpbmcgdGhlIGFjdGlvbiBidXR0b24uICovXG4gIHByaXZhdGUgX2Rpc21pc3NlZEJ5QWN0aW9uID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoY29udGFpbmVySW5zdGFuY2U6IE1hdFNuYWNrQmFyQ29udGFpbmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmKSB7XG4gICAgdGhpcy5jb250YWluZXJJbnN0YW5jZSA9IGNvbnRhaW5lckluc3RhbmNlO1xuICAgIC8vIERpc21pc3Mgc25hY2tiYXIgb24gYWN0aW9uLlxuICAgIHRoaXMub25BY3Rpb24oKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5kaXNtaXNzKCkpO1xuICAgIGNvbnRhaW5lckluc3RhbmNlLl9vbkV4aXQuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2ZpbmlzaERpc21pc3MoKSk7XG4gIH1cblxuICAvKiogRGlzbWlzc2VzIHRoZSBzbmFjayBiYXIuICovXG4gIGRpc21pc3MoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hZnRlckRpc21pc3NlZC5jbG9zZWQpIHtcbiAgICAgIHRoaXMuY29udGFpbmVySW5zdGFuY2UuZXhpdCgpO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZHVyYXRpb25UaW1lb3V0SWQpO1xuICB9XG5cbiAgLyoqIE1hcmtzIHRoZSBzbmFja2JhciBhY3Rpb24gY2xpY2tlZC4gKi9cbiAgZGlzbWlzc1dpdGhBY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9vbkFjdGlvbi5jbG9zZWQpIHtcbiAgICAgIHRoaXMuX2Rpc21pc3NlZEJ5QWN0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuX29uQWN0aW9uLm5leHQoKTtcbiAgICAgIHRoaXMuX29uQWN0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogTWFya3MgdGhlIHNuYWNrYmFyIGFjdGlvbiBjbGlja2VkLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGRpc21pc3NXaXRoQWN0aW9uYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBjbG9zZVdpdGhBY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5kaXNtaXNzV2l0aEFjdGlvbigpO1xuICB9XG5cbiAgLyoqIERpc21pc3NlcyB0aGUgc25hY2sgYmFyIGFmdGVyIHNvbWUgZHVyYXRpb24gKi9cbiAgX2Rpc21pc3NBZnRlcihkdXJhdGlvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIG5lZWQgdG8gY2FwIHRoZSBkdXJhdGlvbiB0byB0aGUgbWF4aW11bSB2YWx1ZSBmb3Igc2V0VGltZW91dCwgYmVjYXVzZVxuICAgIC8vIGl0J2xsIHJldmVydCB0byAxIGlmIHNvbWVib2R5IHBhc3NlcyBpbiBzb21ldGhpbmcgZ3JlYXRlciAoZS5nLiBgSW5maW5pdHlgKS4gU2VlICMxNzIzNC5cbiAgICB0aGlzLl9kdXJhdGlvblRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kaXNtaXNzKCksIE1hdGgubWluKGR1cmF0aW9uLCBNQVhfVElNRU9VVCkpO1xuICB9XG5cbiAgLyoqIE1hcmtzIHRoZSBzbmFja2JhciBhcyBvcGVuZWQgKi9cbiAgX29wZW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hZnRlck9wZW5lZC5jbG9zZWQpIHtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLm5leHQoKTtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsZWFucyB1cCB0aGUgRE9NIGFmdGVyIGNsb3NpbmcuICovXG4gIHByaXZhdGUgX2ZpbmlzaERpc21pc3MoKTogdm9pZCB7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG5cbiAgICBpZiAoIXRoaXMuX29uQWN0aW9uLmNsb3NlZCkge1xuICAgICAgdGhpcy5fb25BY3Rpb24uY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZnRlckRpc21pc3NlZC5uZXh0KHtkaXNtaXNzZWRCeUFjdGlvbjogdGhpcy5fZGlzbWlzc2VkQnlBY3Rpb259KTtcbiAgICB0aGlzLl9hZnRlckRpc21pc3NlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rpc21pc3NlZEJ5QWN0aW9uID0gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgc25hY2sgYmFyIGlzIGZpbmlzaGVkIGNsb3NpbmcuICovXG4gIGFmdGVyRGlzbWlzc2VkKCk6IE9ic2VydmFibGU8TWF0U25hY2tCYXJEaXNtaXNzPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FmdGVyRGlzbWlzc2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHNuYWNrIGJhciBoYXMgb3BlbmVkIGFuZCBhcHBlYXJlZC4gKi9cbiAgYWZ0ZXJPcGVuZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVySW5zdGFuY2UuX29uRW50ZXI7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgc25hY2sgYmFyIGFjdGlvbiBpcyBjYWxsZWQuICovXG4gIG9uQWN0aW9uKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9vbkFjdGlvbi5hc09ic2VydmFibGUoKTtcbiAgfVxufVxuIl19