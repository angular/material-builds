/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
/** Maximum amount of milliseconds that can be passed into setTimeout. */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
export class MatSnackBarRef {
    constructor(containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the snack bar has been dismissed. */
        this._afterDismissed = new Subject();
        /** Subject for notifying the user that the snack bar has opened and appeared. */
        this._afterOpened = new Subject();
        /** Subject for notifying the user that the snack bar action was called. */
        this._onAction = new Subject();
        /** Whether the snack bar was dismissed using the action button. */
        this._dismissedByAction = false;
        this.containerInstance = containerInstance;
        containerInstance._onExit.subscribe(() => this._finishDismiss());
    }
    /** Dismisses the snack bar. */
    dismiss() {
        if (!this._afterDismissed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    }
    /** Marks the snackbar action clicked. */
    dismissWithAction() {
        if (!this._onAction.closed) {
            this._dismissedByAction = true;
            this._onAction.next();
            this._onAction.complete();
            this.dismiss();
        }
        clearTimeout(this._durationTimeoutId);
    }
    /**
     * Marks the snackbar action clicked.
     * @deprecated Use `dismissWithAction` instead.
     * @breaking-change 8.0.0
     */
    closeWithAction() {
        this.dismissWithAction();
    }
    /** Dismisses the snack bar after some duration */
    _dismissAfter(duration) {
        // Note that we need to cap the duration to the maximum value for setTimeout, because
        // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
        this._durationTimeoutId = setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT));
    }
    /** Marks the snackbar as opened */
    _open() {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    }
    /** Cleans up the DOM after closing. */
    _finishDismiss() {
        this._overlayRef.dispose();
        if (!this._onAction.closed) {
            this._onAction.complete();
        }
        this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
        this._afterDismissed.complete();
        this._dismissedByAction = false;
    }
    /** Gets an observable that is notified when the snack bar is finished closing. */
    afterDismissed() {
        return this._afterDismissed;
    }
    /** Gets an observable that is notified when the snack bar has opened and appeared. */
    afterOpened() {
        return this.containerInstance._onEnter;
    }
    /** Gets an observable that is notified when the snack bar action is called. */
    onAction() {
        return this._onAction;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBU3pDLHlFQUF5RTtBQUN6RSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQTRCekIsWUFDRSxpQkFBdUMsRUFDL0IsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFwQmpDLDRFQUE0RTtRQUMzRCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFzQixDQUFDO1FBRXJFLGlGQUFpRjtRQUNoRSxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFcEQsMkVBQTJFO1FBQzFELGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBUWpELG1FQUFtRTtRQUMzRCx1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFNakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELCtCQUErQjtJQUMvQixPQUFPO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxpQkFBaUI7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUNELFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGVBQWU7UUFDYixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELGFBQWEsQ0FBQyxRQUFnQjtRQUM1QixxRkFBcUY7UUFDckYsMkZBQTJGO1FBQzNGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxLQUFLO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDO0lBRUQsdUNBQXVDO0lBQy9CLGNBQWM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0ZBQXNGO0lBQ3RGLFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFDekMsQ0FBQztJQUVELCtFQUErRTtJQUMvRSxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29udGFpbmVyfSBmcm9tICcuL3NuYWNrLWJhci1jb250YWluZXInO1xuXG4vKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYSBzbmFjayBiYXIgaXMgZGlzbWlzc2VkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTbmFja0JhckRpc21pc3Mge1xuICAvKiogV2hldGhlciB0aGUgc25hY2sgYmFyIHdhcyBkaXNtaXNzZWQgdXNpbmcgdGhlIGFjdGlvbiBidXR0b24uICovXG4gIGRpc21pc3NlZEJ5QWN0aW9uOiBib29sZWFuO1xufVxuXG4vKiogTWF4aW11bSBhbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRoYXQgY2FuIGJlIHBhc3NlZCBpbnRvIHNldFRpbWVvdXQuICovXG5jb25zdCBNQVhfVElNRU9VVCA9IE1hdGgucG93KDIsIDMxKSAtIDE7XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgc25hY2sgYmFyIGRpc3BhdGNoZWQgZnJvbSB0aGUgc25hY2sgYmFyIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbmFja0JhclJlZjxUPiB7XG4gIC8qKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIHNuYWNrIGJhci4gKi9cbiAgaW5zdGFuY2U6IFQ7XG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IG1ha2luZyB1cCB0aGUgY29udGVudCBvZiB0aGUgc25hY2sgYmFyLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb250YWluZXJJbnN0YW5jZTogTWF0U25hY2tCYXJDb250YWluZXI7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIGJlZW4gZGlzbWlzc2VkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlckRpc21pc3NlZCA9IG5ldyBTdWJqZWN0PE1hdFNuYWNrQmFyRGlzbWlzcz4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIHNuYWNrIGJhciBoYXMgb3BlbmVkIGFuZCBhcHBlYXJlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgc25hY2sgYmFyIGFjdGlvbiB3YXMgY2FsbGVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkFjdGlvbiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRpbWVvdXQgSUQgZm9yIHRoZSBkdXJhdGlvbiBzZXRUaW1lb3V0IGNhbGwuIFVzZWQgdG8gY2xlYXIgdGhlIHRpbWVvdXQgaWYgdGhlIHNuYWNrYmFyIGlzXG4gICAqIGRpc21pc3NlZCBiZWZvcmUgdGhlIGR1cmF0aW9uIHBhc3Nlcy5cbiAgICovXG4gIHByaXZhdGUgX2R1cmF0aW9uVGltZW91dElkOiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNuYWNrIGJhciB3YXMgZGlzbWlzc2VkIHVzaW5nIHRoZSBhY3Rpb24gYnV0dG9uLiAqL1xuICBwcml2YXRlIF9kaXNtaXNzZWRCeUFjdGlvbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbnRhaW5lckluc3RhbmNlOiBNYXRTbmFja0JhckNvbnRhaW5lcixcbiAgICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICApIHtcbiAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlID0gY29udGFpbmVySW5zdGFuY2U7XG4gICAgY29udGFpbmVySW5zdGFuY2UuX29uRXhpdC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZmluaXNoRGlzbWlzcygpKTtcbiAgfVxuXG4gIC8qKiBEaXNtaXNzZXMgdGhlIHNuYWNrIGJhci4gKi9cbiAgZGlzbWlzcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2FmdGVyRGlzbWlzc2VkLmNsb3NlZCkge1xuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5leGl0KCk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kdXJhdGlvblRpbWVvdXRJZCk7XG4gIH1cblxuICAvKiogTWFya3MgdGhlIHNuYWNrYmFyIGFjdGlvbiBjbGlja2VkLiAqL1xuICBkaXNtaXNzV2l0aEFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX29uQWN0aW9uLmNsb3NlZCkge1xuICAgICAgdGhpcy5fZGlzbWlzc2VkQnlBY3Rpb24gPSB0cnVlO1xuICAgICAgdGhpcy5fb25BY3Rpb24ubmV4dCgpO1xuICAgICAgdGhpcy5fb25BY3Rpb24uY29tcGxldGUoKTtcbiAgICAgIHRoaXMuZGlzbWlzcygpO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZHVyYXRpb25UaW1lb3V0SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBzbmFja2JhciBhY3Rpb24gY2xpY2tlZC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBkaXNtaXNzV2l0aEFjdGlvbmAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgY2xvc2VXaXRoQWN0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuZGlzbWlzc1dpdGhBY3Rpb24oKTtcbiAgfVxuXG4gIC8qKiBEaXNtaXNzZXMgdGhlIHNuYWNrIGJhciBhZnRlciBzb21lIGR1cmF0aW9uICovXG4gIF9kaXNtaXNzQWZ0ZXIoZHVyYXRpb246IG51bWJlcik6IHZvaWQge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIGNhcCB0aGUgZHVyYXRpb24gdG8gdGhlIG1heGltdW0gdmFsdWUgZm9yIHNldFRpbWVvdXQsIGJlY2F1c2VcbiAgICAvLyBpdCdsbCByZXZlcnQgdG8gMSBpZiBzb21lYm9keSBwYXNzZXMgaW4gc29tZXRoaW5nIGdyZWF0ZXIgKGUuZy4gYEluZmluaXR5YCkuIFNlZSAjMTcyMzQuXG4gICAgdGhpcy5fZHVyYXRpb25UaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZGlzbWlzcygpLCBNYXRoLm1pbihkdXJhdGlvbiwgTUFYX1RJTUVPVVQpKTtcbiAgfVxuXG4gIC8qKiBNYXJrcyB0aGUgc25hY2tiYXIgYXMgb3BlbmVkICovXG4gIF9vcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fYWZ0ZXJPcGVuZWQuY2xvc2VkKSB7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5uZXh0KCk7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhbnMgdXAgdGhlIERPTSBhZnRlciBjbG9zaW5nLiAqL1xuICBwcml2YXRlIF9maW5pc2hEaXNtaXNzKCk6IHZvaWQge1xuICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuXG4gICAgaWYgKCF0aGlzLl9vbkFjdGlvbi5jbG9zZWQpIHtcbiAgICAgIHRoaXMuX29uQWN0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQubmV4dCh7ZGlzbWlzc2VkQnlBY3Rpb246IHRoaXMuX2Rpc21pc3NlZEJ5QWN0aW9ufSk7XG4gICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kaXNtaXNzZWRCeUFjdGlvbiA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHNuYWNrIGJhciBpcyBmaW5pc2hlZCBjbG9zaW5nLiAqL1xuICBhZnRlckRpc21pc3NlZCgpOiBPYnNlcnZhYmxlPE1hdFNuYWNrQmFyRGlzbWlzcz4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlckRpc21pc3NlZDtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzbmFjayBiYXIgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXG4gIGFmdGVyT3BlbmVkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lckluc3RhbmNlLl9vbkVudGVyO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHNuYWNrIGJhciBhY3Rpb24gaXMgY2FsbGVkLiAqL1xuICBvbkFjdGlvbigpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb25BY3Rpb247XG4gIH1cbn1cbiJdfQ==