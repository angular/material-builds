/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
/**
 * Reference to a bottom sheet dispatched from the bottom sheet service.
 */
var MatBottomSheetRef = /** @class */ (function () {
    function MatBottomSheetRef(containerInstance, _overlayRef, 
    // @breaking-change 8.0.0 `_location` parameter to be removed.
    _location) {
        var _this = this;
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the bottom sheet has been dismissed. */
        this._afterDismissed = new Subject();
        /** Subject for notifying the user that the bottom sheet has opened and appeared. */
        this._afterOpened = new Subject();
        this.containerInstance = containerInstance;
        this.disableClose = containerInstance.bottomSheetConfig.disableClose;
        // Emit when opening animation completes
        containerInstance._animationStateChanged.pipe(filter(function (event) { return event.phaseName === 'done' && event.toState === 'visible'; }), take(1))
            .subscribe(function () {
            _this._afterOpened.next();
            _this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        containerInstance._animationStateChanged
            .pipe(filter(function (event) { return event.phaseName === 'done' && event.toState === 'hidden'; }), take(1))
            .subscribe(function () {
            clearTimeout(_this._closeFallbackTimeout);
            _overlayRef.dispose();
        });
        _overlayRef.detachments().pipe(take(1)).subscribe(function () {
            _this._afterDismissed.next(_this._result);
            _this._afterDismissed.complete();
        });
        merge(_overlayRef.backdropClick(), _overlayRef.keydownEvents().pipe(filter(function (event) { return event.keyCode === ESCAPE; }))).subscribe(function (event) {
            if (!_this.disableClose &&
                (event.type !== 'keydown' || !hasModifierKey(event))) {
                event.preventDefault();
                _this.dismiss();
            }
        });
    }
    /**
     * Dismisses the bottom sheet.
     * @param result Data to be passed back to the bottom sheet opener.
     */
    MatBottomSheetRef.prototype.dismiss = function (result) {
        var _this = this;
        if (!this._afterDismissed.closed) {
            // Transition the backdrop in parallel to the bottom sheet.
            this.containerInstance._animationStateChanged.pipe(filter(function (event) { return event.phaseName === 'start'; }), take(1)).subscribe(function (event) {
                // The logic that disposes of the overlay depends on the exit animation completing, however
                // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
                // timeout which will clean everything up if the animation hasn't fired within the specified
                // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
                // vast majority of cases the timeout will have been cleared before it has fired.
                _this._closeFallbackTimeout = setTimeout(function () {
                    _this._overlayRef.dispose();
                }, event.totalTime + 100);
                _this._overlayRef.detachBackdrop();
            });
            this._result = result;
            this.containerInstance.exit();
        }
    };
    /** Gets an observable that is notified when the bottom sheet is finished closing. */
    MatBottomSheetRef.prototype.afterDismissed = function () {
        return this._afterDismissed.asObservable();
    };
    /** Gets an observable that is notified when the bottom sheet has opened and appeared. */
    MatBottomSheetRef.prototype.afterOpened = function () {
        return this._afterOpened.asObservable();
    };
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    MatBottomSheetRef.prototype.backdropClick = function () {
        return this._overlayRef.backdropClick();
    };
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    MatBottomSheetRef.prototype.keydownEvents = function () {
        return this._overlayRef.keydownEvents();
    };
    return MatBottomSheetRef;
}());
export { MatBottomSheetRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTdELE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFJNUM7O0dBRUc7QUFDSDtJQXlCRSwyQkFDRSxpQkFBMEMsRUFDbEMsV0FBdUI7SUFDL0IsOERBQThEO0lBQzlELFNBQW9CO1FBSnRCLGlCQXlDQztRQXZDUyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQWRqQywrRUFBK0U7UUFDOUQsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQztRQUVoRSxvRkFBb0Y7UUFDbkUsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBYWxELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQztRQUVyRSx3Q0FBd0M7UUFDeEMsaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUMzQyxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBekQsQ0FBeUQsQ0FBQyxFQUMxRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQ1I7YUFDQSxTQUFTLENBQUM7WUFDVCxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxxREFBcUQ7UUFDckQsaUJBQWlCLENBQUMsc0JBQXNCO2FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBeEQsQ0FBd0QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4RixTQUFTLENBQUM7WUFDVCxZQUFZLENBQUMsS0FBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDekMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRVAsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDaEQsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxLQUFLLENBQ0gsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUMzQixXQUFXLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUF4QixDQUF3QixDQUFDLENBQUMsQ0FDNUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO1lBQ2YsSUFBSSxDQUFDLEtBQUksQ0FBQyxZQUFZO2dCQUNwQixDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQXNCLENBQUMsQ0FBQyxFQUFFO2dCQUN2RSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNoQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILG1DQUFPLEdBQVAsVUFBUSxNQUFVO1FBQWxCLGlCQXNCQztRQXJCQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDaEMsMkRBQTJEO1lBQzNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQ2hELE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUEzQixDQUEyQixDQUFDLEVBQzVDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUixDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7Z0JBQ2YsMkZBQTJGO2dCQUMzRix5RkFBeUY7Z0JBQ3pGLDRGQUE0RjtnQkFDNUYsMkZBQTJGO2dCQUMzRixpRkFBaUY7Z0JBQ2pGLEtBQUksQ0FBQyxxQkFBcUIsR0FBRyxVQUFVLENBQUM7b0JBQ3RDLEtBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzdCLENBQUMsRUFBRSxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUUxQixLQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUVELHFGQUFxRjtJQUNyRiwwQ0FBYyxHQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCx5RkFBeUY7SUFDekYsdUNBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx5Q0FBYSxHQUFiO1FBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRDs7T0FFRztJQUNILHlDQUFhLEdBQWI7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQXZIRCxJQXVIQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0Q29udGFpbmVyfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb250YWluZXInO1xuXG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgYm90dG9tIHNoZWV0IGRpc3BhdGNoZWQgZnJvbSB0aGUgYm90dG9tIHNoZWV0IHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldFJlZjxUID0gYW55LCBSID0gYW55PiB7XG4gIC8qKiBJbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IG1ha2luZyB1cCB0aGUgY29udGVudCBvZiB0aGUgYm90dG9tIHNoZWV0LiAqL1xuICBpbnN0YW5jZTogVDtcblxuICAvKipcbiAgICogSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBpbnRvIHdoaWNoIHRoZSBib3R0b20gc2hlZXQgY29udGVudCBpcyBwcm9qZWN0ZWQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGNvbnRhaW5lckluc3RhbmNlOiBNYXRCb3R0b21TaGVldENvbnRhaW5lcjtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBhbGxvd2VkIHRvIGNsb3NlIHRoZSBib3R0b20gc2hlZXQuICovXG4gIGRpc2FibGVDbG9zZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGJvdHRvbSBzaGVldCBoYXMgYmVlbiBkaXNtaXNzZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyRGlzbWlzc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGJvdHRvbSBzaGVldCBoYXMgb3BlbmVkIGFuZCBhcHBlYXJlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBSZXN1bHQgdG8gYmUgcGFzc2VkIGRvd24gdG8gdGhlIGBhZnRlckRpc21pc3NlZGAgc3RyZWFtLiAqL1xuICBwcml2YXRlIF9yZXN1bHQ6IFIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEhhbmRsZSB0byB0aGUgdGltZW91dCB0aGF0J3MgcnVubmluZyBhcyBhIGZhbGxiYWNrIGluIGNhc2UgdGhlIGV4aXQgYW5pbWF0aW9uIGRvZXNuJ3QgZmlyZS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VGYWxsYmFja1RpbWVvdXQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb250YWluZXJJbnN0YW5jZTogTWF0Qm90dG9tU2hlZXRDb250YWluZXIsXG4gICAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBfbG9jYXRpb25gIHBhcmFtZXRlciB0byBiZSByZW1vdmVkLlxuICAgIF9sb2NhdGlvbj86IExvY2F0aW9uKSB7XG4gICAgdGhpcy5jb250YWluZXJJbnN0YW5jZSA9IGNvbnRhaW5lckluc3RhbmNlO1xuICAgIHRoaXMuZGlzYWJsZUNsb3NlID0gY29udGFpbmVySW5zdGFuY2UuYm90dG9tU2hlZXRDb25maWcuZGlzYWJsZUNsb3NlO1xuXG4gICAgLy8gRW1pdCB3aGVuIG9wZW5pbmcgYW5pbWF0aW9uIGNvbXBsZXRlc1xuICAgIGNvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQucGlwZShcbiAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC5waGFzZU5hbWUgPT09ICdkb25lJyAmJiBldmVudC50b1N0YXRlID09PSAndmlzaWJsZScpLFxuICAgICAgdGFrZSgxKVxuICAgIClcbiAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLm5leHQoKTtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNwb3NlIG92ZXJsYXkgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuICAgIGNvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWRcbiAgICAgICAgLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdoaWRkZW4nKSwgdGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0KTtcbiAgICAgICAgICBfb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9hZnRlckRpc21pc3NlZC5uZXh0KHRoaXMuX3Jlc3VsdCk7XG4gICAgICB0aGlzLl9hZnRlckRpc21pc3NlZC5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgbWVyZ2UoXG4gICAgICBfb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCksXG4gICAgICBfb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFKSlcbiAgICApLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZUNsb3NlICYmXG4gICAgICAgIChldmVudC50eXBlICE9PSAna2V5ZG93bicgfHwgIWhhc01vZGlmaWVyS2V5KGV2ZW50IGFzIEtleWJvYXJkRXZlbnQpKSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmRpc21pc3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIHJlc3VsdCBEYXRhIHRvIGJlIHBhc3NlZCBiYWNrIHRvIHRoZSBib3R0b20gc2hlZXQgb3BlbmVyLlxuICAgKi9cbiAgZGlzbWlzcyhyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hZnRlckRpc21pc3NlZC5jbG9zZWQpIHtcbiAgICAgIC8vIFRyYW5zaXRpb24gdGhlIGJhY2tkcm9wIGluIHBhcmFsbGVsIHRvIHRoZSBib3R0b20gc2hlZXQuXG4gICAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ3N0YXJ0JyksXG4gICAgICAgIHRha2UoMSlcbiAgICAgICkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gVGhlIGxvZ2ljIHRoYXQgZGlzcG9zZXMgb2YgdGhlIG92ZXJsYXkgZGVwZW5kcyBvbiB0aGUgZXhpdCBhbmltYXRpb24gY29tcGxldGluZywgaG93ZXZlclxuICAgICAgICAvLyBpdCBpc24ndCBndWFyYW50ZWVkIGlmIHRoZSBwYXJlbnQgdmlldyBpcyBkZXN0cm95ZWQgd2hpbGUgaXQncyBydW5uaW5nLiBBZGQgYSBmYWxsYmFja1xuICAgICAgICAvLyB0aW1lb3V0IHdoaWNoIHdpbGwgY2xlYW4gZXZlcnl0aGluZyB1cCBpZiB0aGUgYW5pbWF0aW9uIGhhc24ndCBmaXJlZCB3aXRoaW4gdGhlIHNwZWNpZmllZFxuICAgICAgICAvLyBhbW91bnQgb2YgdGltZSBwbHVzIDEwMG1zLiBXZSBkb24ndCBuZWVkIHRvIHJ1biB0aGlzIG91dHNpZGUgdGhlIE5nWm9uZSwgYmVjYXVzZSBmb3IgdGhlXG4gICAgICAgIC8vIHZhc3QgbWFqb3JpdHkgb2YgY2FzZXMgdGhlIHRpbWVvdXQgd2lsbCBoYXZlIGJlZW4gY2xlYXJlZCBiZWZvcmUgaXQgaGFzIGZpcmVkLlxuICAgICAgICB0aGlzLl9jbG9zZUZhbGxiYWNrVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgICB9LCBldmVudC50b3RhbFRpbWUgKyAxMDApO1xuXG4gICAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoQmFja2Ryb3AoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9yZXN1bHQgPSByZXN1bHQ7XG4gICAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlLmV4aXQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgYm90dG9tIHNoZWV0IGlzIGZpbmlzaGVkIGNsb3NpbmcuICovXG4gIGFmdGVyRGlzbWlzc2VkKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlckRpc21pc3NlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBib3R0b20gc2hlZXQgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXG4gIGFmdGVyT3BlbmVkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlck9wZW5lZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBvdmVybGF5J3MgYmFja2Ryb3AgaGFzIGJlZW4gY2xpY2tlZC5cbiAgICovXG4gIGJhY2tkcm9wQ2xpY2soKTogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4ga2V5ZG93biBldmVudHMgYXJlIHRhcmdldGVkIG9uIHRoZSBvdmVybGF5LlxuICAgKi9cbiAga2V5ZG93bkV2ZW50cygpOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCk7XG4gIH1cbn1cbiJdfQ==