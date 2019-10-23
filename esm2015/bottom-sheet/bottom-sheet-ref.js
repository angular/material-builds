/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * @template T, R
 */
export class MatBottomSheetRef {
    /**
     * @param {?} containerInstance
     * @param {?} _overlayRef
     * @param {?=} _location
     */
    constructor(containerInstance, _overlayRef, 
    // @breaking-change 8.0.0 `_location` parameter to be removed.
    _location) {
        this._overlayRef = _overlayRef;
        /**
         * Subject for notifying the user that the bottom sheet has been dismissed.
         */
        this._afterDismissed = new Subject();
        /**
         * Subject for notifying the user that the bottom sheet has opened and appeared.
         */
        this._afterOpened = new Subject();
        this.containerInstance = containerInstance;
        this.disableClose = containerInstance.bottomSheetConfig.disableClose;
        // Emit when opening animation completes
        containerInstance._animationStateChanged.pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.phaseName === 'done' && event.toState === 'visible')), take(1))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._afterOpened.next();
            this._afterOpened.complete();
        }));
        // Dispose overlay when closing animation is complete
        containerInstance._animationStateChanged
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.phaseName === 'done' && event.toState === 'hidden')), take(1))
            .subscribe((/**
         * @return {?}
         */
        () => {
            clearTimeout(this._closeFallbackTimeout);
            _overlayRef.dispose();
        }));
        _overlayRef.detachments().pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => {
            this._afterDismissed.next(this._result);
            this._afterDismissed.complete();
        }));
        merge(_overlayRef.backdropClick(), _overlayRef.keydownEvents().pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.keyCode === ESCAPE)))).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (!this.disableClose &&
                (event.type !== 'keydown' || !hasModifierKey((/** @type {?} */ (event))))) {
                event.preventDefault();
                this.dismiss();
            }
        }));
    }
    /**
     * Dismisses the bottom sheet.
     * @param {?=} result Data to be passed back to the bottom sheet opener.
     * @return {?}
     */
    dismiss(result) {
        if (!this._afterDismissed.closed) {
            // Transition the backdrop in parallel to the bottom sheet.
            this.containerInstance._animationStateChanged.pipe(filter((/**
             * @param {?} event
             * @return {?}
             */
            event => event.phaseName === 'start')), take(1)).subscribe((/**
             * @param {?} event
             * @return {?}
             */
            event => {
                // The logic that disposes of the overlay depends on the exit animation completing, however
                // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
                // timeout which will clean everything up if the animation hasn't fired within the specified
                // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
                // vast majority of cases the timeout will have been cleared before it has fired.
                this._closeFallbackTimeout = setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this._overlayRef.dispose();
                }), event.totalTime + 100);
                this._overlayRef.detachBackdrop();
            }));
            this._result = result;
            this.containerInstance.exit();
        }
    }
    /**
     * Gets an observable that is notified when the bottom sheet is finished closing.
     * @return {?}
     */
    afterDismissed() {
        return this._afterDismissed.asObservable();
    }
    /**
     * Gets an observable that is notified when the bottom sheet has opened and appeared.
     * @return {?}
     */
    afterOpened() {
        return this._afterOpened.asObservable();
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     * @return {?}
     */
    backdropClick() {
        return this._overlayRef.backdropClick();
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     * @return {?}
     */
    keydownEvents() {
        return this._overlayRef.keydownEvents();
    }
}
if (false) {
    /**
     * Instance of the component making up the content of the bottom sheet.
     * @type {?}
     */
    MatBottomSheetRef.prototype.instance;
    /**
     * Instance of the component into which the bottom sheet content is projected.
     * \@docs-private
     * @type {?}
     */
    MatBottomSheetRef.prototype.containerInstance;
    /**
     * Whether the user is allowed to close the bottom sheet.
     * @type {?}
     */
    MatBottomSheetRef.prototype.disableClose;
    /**
     * Subject for notifying the user that the bottom sheet has been dismissed.
     * @type {?}
     * @private
     */
    MatBottomSheetRef.prototype._afterDismissed;
    /**
     * Subject for notifying the user that the bottom sheet has opened and appeared.
     * @type {?}
     * @private
     */
    MatBottomSheetRef.prototype._afterOpened;
    /**
     * Result to be passed down to the `afterDismissed` stream.
     * @type {?}
     * @private
     */
    MatBottomSheetRef.prototype._result;
    /**
     * Handle to the timeout that's running as a fallback in case the exit animation doesn't fire.
     * @type {?}
     * @private
     */
    MatBottomSheetRef.prototype._closeFallbackTimeout;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheetRef.prototype._overlayRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVNBLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFN0QsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFPNUMsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7O0lBeUI1QixZQUNFLGlCQUEwQyxFQUNsQyxXQUF1QjtJQUMvQiw4REFBOEQ7SUFDOUQsU0FBb0I7UUFGWixnQkFBVyxHQUFYLFdBQVcsQ0FBWTs7OztRQWJoQixvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDOzs7O1FBRy9DLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWFsRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7UUFFckUsd0NBQXdDO1FBQ3hDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FDM0MsTUFBTTs7OztRQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUMsRUFDMUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUNSO2FBQ0EsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFB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QWE7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDMUMsQ0FBQztDQUNGOzs7Ozs7SUFySEMscUNBQVk7Ozs7OztJQU1aLDhDQUEyQzs7Ozs7SUFHM0MseUNBQWtDOzs7Ozs7SUFHbEMsNENBQWdFOzs7Ozs7SUFHaEUseUNBQW9EOzs7Ozs7SUFHcEQsb0NBQStCOzs7Ozs7SUFHL0Isa0RBQXNDOzs7OztJQUlwQyx3Q0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7T3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHttZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldENvbnRhaW5lcn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29udGFpbmVyJztcblxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIGJvdHRvbSBzaGVldCBkaXNwYXRjaGVkIGZyb20gdGhlIGJvdHRvbSBzaGVldCBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0Qm90dG9tU2hlZXRSZWY8VCA9IGFueSwgUiA9IGFueT4ge1xuICAvKiogSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIGJvdHRvbSBzaGVldC4gKi9cbiAgaW5zdGFuY2U6IFQ7XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgaW50byB3aGljaCB0aGUgYm90dG9tIHNoZWV0IGNvbnRlbnQgaXMgcHJvamVjdGVkLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBjb250YWluZXJJbnN0YW5jZTogTWF0Qm90dG9tU2hlZXRDb250YWluZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgYWxsb3dlZCB0byBjbG9zZSB0aGUgYm90dG9tIHNoZWV0LiAqL1xuICBkaXNhYmxlQ2xvc2U6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBib3R0b20gc2hlZXQgaGFzIGJlZW4gZGlzbWlzc2VkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlckRpc21pc3NlZCA9IG5ldyBTdWJqZWN0PFIgfCB1bmRlZmluZWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBib3R0b20gc2hlZXQgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogUmVzdWx0IHRvIGJlIHBhc3NlZCBkb3duIHRvIHRoZSBgYWZ0ZXJEaXNtaXNzZWRgIHN0cmVhbS4gKi9cbiAgcHJpdmF0ZSBfcmVzdWx0OiBSIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBIYW5kbGUgdG8gdGhlIHRpbWVvdXQgdGhhdCdzIHJ1bm5pbmcgYXMgYSBmYWxsYmFjayBpbiBjYXNlIHRoZSBleGl0IGFuaW1hdGlvbiBkb2Vzbid0IGZpcmUuICovXG4gIHByaXZhdGUgX2Nsb3NlRmFsbGJhY2tUaW1lb3V0OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY29udGFpbmVySW5zdGFuY2U6IE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyLFxuICAgIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgX2xvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICBfbG9jYXRpb24/OiBMb2NhdGlvbikge1xuICAgIHRoaXMuY29udGFpbmVySW5zdGFuY2UgPSBjb250YWluZXJJbnN0YW5jZTtcbiAgICB0aGlzLmRpc2FibGVDbG9zZSA9IGNvbnRhaW5lckluc3RhbmNlLmJvdHRvbVNoZWV0Q29uZmlnLmRpc2FibGVDbG9zZTtcblxuICAgIC8vIEVtaXQgd2hlbiBvcGVuaW5nIGFuaW1hdGlvbiBjb21wbGV0ZXNcbiAgICBjb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnZG9uZScgJiYgZXZlbnQudG9TdGF0ZSA9PT0gJ3Zpc2libGUnKSxcbiAgICAgIHRha2UoMSlcbiAgICApXG4gICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5uZXh0KCk7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gRGlzcG9zZSBvdmVybGF5IHdoZW4gY2xvc2luZyBhbmltYXRpb24gaXMgY29tcGxldGVcbiAgICBjb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXG4gICAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudC5waGFzZU5hbWUgPT09ICdkb25lJyAmJiBldmVudC50b1N0YXRlID09PSAnaGlkZGVuJyksIHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jbG9zZUZhbGxiYWNrVGltZW91dCk7XG4gICAgICAgICAgX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgICB9KTtcblxuICAgIF9vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQubmV4dCh0aGlzLl9yZXN1bHQpO1xuICAgICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIG1lcmdlKFxuICAgICAgX292ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSkpXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVDbG9zZSAmJlxuICAgICAgICAoZXZlbnQudHlwZSAhPT0gJ2tleWRvd24nIHx8ICFoYXNNb2RpZmllcktleShldmVudCBhcyBLZXlib2FyZEV2ZW50KSkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5kaXNtaXNzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBib3R0b20gc2hlZXQuXG4gICAqIEBwYXJhbSByZXN1bHQgRGF0YSB0byBiZSBwYXNzZWQgYmFjayB0byB0aGUgYm90dG9tIHNoZWV0IG9wZW5lci5cbiAgICovXG4gIGRpc21pc3MocmVzdWx0PzogUik6IHZvaWQge1xuICAgIGlmICghdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuY2xvc2VkKSB7XG4gICAgICAvLyBUcmFuc2l0aW9uIHRoZSBiYWNrZHJvcCBpbiBwYXJhbGxlbCB0byB0aGUgYm90dG9tIHNoZWV0LlxuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnBpcGUoXG4gICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC5waGFzZU5hbWUgPT09ICdzdGFydCcpLFxuICAgICAgICB0YWtlKDEpXG4gICAgICApLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIC8vIFRoZSBsb2dpYyB0aGF0IGRpc3Bvc2VzIG9mIHRoZSBvdmVybGF5IGRlcGVuZHMgb24gdGhlIGV4aXQgYW5pbWF0aW9uIGNvbXBsZXRpbmcsIGhvd2V2ZXJcbiAgICAgICAgLy8gaXQgaXNuJ3QgZ3VhcmFudGVlZCBpZiB0aGUgcGFyZW50IHZpZXcgaXMgZGVzdHJveWVkIHdoaWxlIGl0J3MgcnVubmluZy4gQWRkIGEgZmFsbGJhY2tcbiAgICAgICAgLy8gdGltZW91dCB3aGljaCB3aWxsIGNsZWFuIGV2ZXJ5dGhpbmcgdXAgaWYgdGhlIGFuaW1hdGlvbiBoYXNuJ3QgZmlyZWQgd2l0aGluIHRoZSBzcGVjaWZpZWRcbiAgICAgICAgLy8gYW1vdW50IG9mIHRpbWUgcGx1cyAxMDBtcy4gV2UgZG9uJ3QgbmVlZCB0byBydW4gdGhpcyBvdXRzaWRlIHRoZSBOZ1pvbmUsIGJlY2F1c2UgZm9yIHRoZVxuICAgICAgICAvLyB2YXN0IG1ham9yaXR5IG9mIGNhc2VzIHRoZSB0aW1lb3V0IHdpbGwgaGF2ZSBiZWVuIGNsZWFyZWQgYmVmb3JlIGl0IGhhcyBmaXJlZC5cbiAgICAgICAgdGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgICAgfSwgZXZlbnQudG90YWxUaW1lICsgMTAwKTtcblxuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaEJhY2tkcm9wKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fcmVzdWx0ID0gcmVzdWx0O1xuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5leGl0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGJvdHRvbSBzaGVldCBpcyBmaW5pc2hlZCBjbG9zaW5nLiAqL1xuICBhZnRlckRpc21pc3NlZCgpOiBPYnNlcnZhYmxlPFIgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgYm90dG9tIHNoZWV0IGhhcyBvcGVuZWQgYW5kIGFwcGVhcmVkLiAqL1xuICBhZnRlck9wZW5lZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJPcGVuZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgb3ZlcmxheSdzIGJhY2tkcm9wIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAqL1xuICBiYWNrZHJvcENsaWNrKCk6IE9ic2VydmFibGU8TW91c2VFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGtleWRvd24gZXZlbnRzIGFyZSB0YXJnZXRlZCBvbiB0aGUgb3ZlcmxheS5cbiAgICovXG4gIGtleWRvd25FdmVudHMoKTogT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpO1xuICB9XG59XG4iXX0=