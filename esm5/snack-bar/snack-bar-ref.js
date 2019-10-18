/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
/** Maximum amount of milliseconds that can be passed into setTimeout. */
var MAX_TIMEOUT = Math.pow(2, 31) - 1;
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
var MatSnackBarRef = /** @class */ (function () {
    function MatSnackBarRef(containerInstance, _overlayRef) {
        var _this = this;
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
        // Dismiss snackbar on action.
        this.onAction().subscribe(function () { return _this.dismiss(); });
        containerInstance._onExit.subscribe(function () { return _this._finishDismiss(); });
    }
    /** Dismisses the snack bar. */
    MatSnackBarRef.prototype.dismiss = function () {
        if (!this._afterDismissed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    };
    /** Marks the snackbar action clicked. */
    MatSnackBarRef.prototype.dismissWithAction = function () {
        if (!this._onAction.closed) {
            this._dismissedByAction = true;
            this._onAction.next();
            this._onAction.complete();
        }
    };
    /**
     * Marks the snackbar action clicked.
     * @deprecated Use `dismissWithAction` instead.
     * @breaking-change 8.0.0
     */
    MatSnackBarRef.prototype.closeWithAction = function () {
        this.dismissWithAction();
    };
    /** Dismisses the snack bar after some duration */
    MatSnackBarRef.prototype._dismissAfter = function (duration) {
        var _this = this;
        // Note that we need to cap the duration to the maximum value for setTimeout, because
        // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
        this._durationTimeoutId = setTimeout(function () { return _this.dismiss(); }, Math.min(duration, MAX_TIMEOUT));
    };
    /** Marks the snackbar as opened */
    MatSnackBarRef.prototype._open = function () {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    };
    /** Cleans up the DOM after closing. */
    MatSnackBarRef.prototype._finishDismiss = function () {
        this._overlayRef.dispose();
        if (!this._onAction.closed) {
            this._onAction.complete();
        }
        this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
        this._afterDismissed.complete();
        this._dismissedByAction = false;
    };
    /** Gets an observable that is notified when the snack bar is finished closing. */
    MatSnackBarRef.prototype.afterDismissed = function () {
        return this._afterDismissed.asObservable();
    };
    /** Gets an observable that is notified when the snack bar has opened and appeared. */
    MatSnackBarRef.prototype.afterOpened = function () {
        return this.containerInstance._onEnter;
    };
    /** Gets an observable that is notified when the snack bar action is called. */
    MatSnackBarRef.prototype.onAction = function () {
        return this._onAction.asObservable();
    };
    return MatSnackBarRef;
}());
export { MatSnackBarRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBVXpDLHlFQUF5RTtBQUN6RSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEM7O0dBRUc7QUFDSDtJQTRCRSx3QkFBWSxpQkFBdUMsRUFDL0IsV0FBdUI7UUFEM0MsaUJBTUM7UUFMbUIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFuQjNDLDRFQUE0RTtRQUMzRCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFzQixDQUFDO1FBRXJFLGlGQUFpRjtRQUNoRSxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFcEQsMkVBQTJFO1FBQzFELGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBUWpELG1FQUFtRTtRQUMzRCx1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFJakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7UUFDaEQsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGNBQWMsRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELCtCQUErQjtJQUMvQixnQ0FBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtRQUNELFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLDBDQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUMxQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsd0NBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsc0NBQWEsR0FBYixVQUFjLFFBQWdCO1FBQTlCLGlCQUlDO1FBSEMscUZBQXFGO1FBQ3JGLDJGQUEyRjtRQUMzRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELG1DQUFtQztJQUNuQyw4QkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCx1Q0FBdUM7SUFDL0IsdUNBQWMsR0FBdEI7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBRUQsa0ZBQWtGO0lBQ2xGLHVDQUFjLEdBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELHNGQUFzRjtJQUN0RixvQ0FBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDO0lBQ3pDLENBQUM7SUFFRCwrRUFBK0U7SUFDL0UsaUNBQVEsR0FBUjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBekdELElBeUdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0U25hY2tCYXJDb250YWluZXJ9IGZyb20gJy4vc25hY2stYmFyLWNvbnRhaW5lcic7XG5cblxuLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIGEgc25hY2sgYmFyIGlzIGRpc21pc3NlZC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U25hY2tCYXJEaXNtaXNzIHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNuYWNrIGJhciB3YXMgZGlzbWlzc2VkIHVzaW5nIHRoZSBhY3Rpb24gYnV0dG9uLiAqL1xuICBkaXNtaXNzZWRCeUFjdGlvbjogYm9vbGVhbjtcbn1cblxuLyoqIE1heGltdW0gYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0aGF0IGNhbiBiZSBwYXNzZWQgaW50byBzZXRUaW1lb3V0LiAqL1xuY29uc3QgTUFYX1RJTUVPVVQgPSBNYXRoLnBvdygyLCAzMSkgLSAxO1xuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHNuYWNrIGJhciBkaXNwYXRjaGVkIGZyb20gdGhlIHNuYWNrIGJhciBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0U25hY2tCYXJSZWY8VD4ge1xuICAvKiogVGhlIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgbWFraW5nIHVwIHRoZSBjb250ZW50IG9mIHRoZSBzbmFjayBiYXIuICovXG4gIGluc3RhbmNlOiBUO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIHNuYWNrIGJhci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29udGFpbmVySW5zdGFuY2U6IE1hdFNuYWNrQmFyQ29udGFpbmVyO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgc25hY2sgYmFyIGhhcyBiZWVuIGRpc21pc3NlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJEaXNtaXNzZWQgPSBuZXcgU3ViamVjdDxNYXRTbmFja0JhckRpc21pc3M+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBzbmFjayBiYXIgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIHNuYWNrIGJhciBhY3Rpb24gd2FzIGNhbGxlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25BY3Rpb24gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IElEIGZvciB0aGUgZHVyYXRpb24gc2V0VGltZW91dCBjYWxsLiBVc2VkIHRvIGNsZWFyIHRoZSB0aW1lb3V0IGlmIHRoZSBzbmFja2JhciBpc1xuICAgKiBkaXNtaXNzZWQgYmVmb3JlIHRoZSBkdXJhdGlvbiBwYXNzZXMuXG4gICAqL1xuICBwcml2YXRlIF9kdXJhdGlvblRpbWVvdXRJZDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbmFjayBiYXIgd2FzIGRpc21pc3NlZCB1c2luZyB0aGUgYWN0aW9uIGJ1dHRvbi4gKi9cbiAgcHJpdmF0ZSBfZGlzbWlzc2VkQnlBY3Rpb24gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihjb250YWluZXJJbnN0YW5jZTogTWF0U25hY2tCYXJDb250YWluZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYpIHtcbiAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlID0gY29udGFpbmVySW5zdGFuY2U7XG4gICAgLy8gRGlzbWlzcyBzbmFja2JhciBvbiBhY3Rpb24uXG4gICAgdGhpcy5vbkFjdGlvbigpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmRpc21pc3MoKSk7XG4gICAgY29udGFpbmVySW5zdGFuY2UuX29uRXhpdC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZmluaXNoRGlzbWlzcygpKTtcbiAgfVxuXG4gIC8qKiBEaXNtaXNzZXMgdGhlIHNuYWNrIGJhci4gKi9cbiAgZGlzbWlzcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2FmdGVyRGlzbWlzc2VkLmNsb3NlZCkge1xuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5leGl0KCk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kdXJhdGlvblRpbWVvdXRJZCk7XG4gIH1cblxuICAvKiogTWFya3MgdGhlIHNuYWNrYmFyIGFjdGlvbiBjbGlja2VkLiAqL1xuICBkaXNtaXNzV2l0aEFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX29uQWN0aW9uLmNsb3NlZCkge1xuICAgICAgdGhpcy5fZGlzbWlzc2VkQnlBY3Rpb24gPSB0cnVlO1xuICAgICAgdGhpcy5fb25BY3Rpb24ubmV4dCgpO1xuICAgICAgdGhpcy5fb25BY3Rpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgc25hY2tiYXIgYWN0aW9uIGNsaWNrZWQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZGlzbWlzc1dpdGhBY3Rpb25gIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGNsb3NlV2l0aEFjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLmRpc21pc3NXaXRoQWN0aW9uKCk7XG4gIH1cblxuICAvKiogRGlzbWlzc2VzIHRoZSBzbmFjayBiYXIgYWZ0ZXIgc29tZSBkdXJhdGlvbiAqL1xuICBfZGlzbWlzc0FmdGVyKGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgbmVlZCB0byBjYXAgdGhlIGR1cmF0aW9uIHRvIHRoZSBtYXhpbXVtIHZhbHVlIGZvciBzZXRUaW1lb3V0LCBiZWNhdXNlXG4gICAgLy8gaXQnbGwgcmV2ZXJ0IHRvIDEgaWYgc29tZWJvZHkgcGFzc2VzIGluIHNvbWV0aGluZyBncmVhdGVyIChlLmcuIGBJbmZpbml0eWApLiBTZWUgIzE3MjM0LlxuICAgIHRoaXMuX2R1cmF0aW9uVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmRpc21pc3MoKSwgTWF0aC5taW4oZHVyYXRpb24sIE1BWF9USU1FT1VUKSk7XG4gIH1cblxuICAvKiogTWFya3MgdGhlIHNuYWNrYmFyIGFzIG9wZW5lZCAqL1xuICBfb3BlbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2FmdGVyT3BlbmVkLmNsb3NlZCkge1xuICAgICAgdGhpcy5fYWZ0ZXJPcGVuZWQubmV4dCgpO1xuICAgICAgdGhpcy5fYWZ0ZXJPcGVuZWQuY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYW5zIHVwIHRoZSBET00gYWZ0ZXIgY2xvc2luZy4gKi9cbiAgcHJpdmF0ZSBfZmluaXNoRGlzbWlzcygpOiB2b2lkIHtcbiAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcblxuICAgIGlmICghdGhpcy5fb25BY3Rpb24uY2xvc2VkKSB7XG4gICAgICB0aGlzLl9vbkFjdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FmdGVyRGlzbWlzc2VkLm5leHQoe2Rpc21pc3NlZEJ5QWN0aW9uOiB0aGlzLl9kaXNtaXNzZWRCeUFjdGlvbn0pO1xuICAgIHRoaXMuX2FmdGVyRGlzbWlzc2VkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGlzbWlzc2VkQnlBY3Rpb24gPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzbmFjayBiYXIgaXMgZmluaXNoZWQgY2xvc2luZy4gKi9cbiAgYWZ0ZXJEaXNtaXNzZWQoKTogT2JzZXJ2YWJsZTxNYXRTbmFja0JhckRpc21pc3M+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgc25hY2sgYmFyIGhhcyBvcGVuZWQgYW5kIGFwcGVhcmVkLiAqL1xuICBhZnRlck9wZW5lZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXJJbnN0YW5jZS5fb25FbnRlcjtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzbmFjayBiYXIgYWN0aW9uIGlzIGNhbGxlZC4gKi9cbiAgb25BY3Rpb24oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX29uQWN0aW9uLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG59XG4iXX0=