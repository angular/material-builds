/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
// TODO(jelbourn): resizing
// Counter for unique dialog ids.
let uniqueId = 0;
/**
 * Reference to a dialog opened via the MatDialog service.
 */
export class MatDialogRef {
    constructor(_overlayRef, _containerInstance, id = `mat-dialog-${uniqueId++}`) {
        this._overlayRef = _overlayRef;
        this._containerInstance = _containerInstance;
        this.id = id;
        /** Whether the user is allowed to close the dialog. */
        this.disableClose = this._containerInstance._config.disableClose;
        /** Subject for notifying the user that the dialog has finished opening. */
        this._afterOpened = new Subject();
        /** Subject for notifying the user that the dialog has finished closing. */
        this._afterClosed = new Subject();
        /** Subject for notifying the user that the dialog has started closing. */
        this._beforeClosed = new Subject();
        /** Current state of the dialog. */
        this._state = 0 /* OPEN */;
        // Pass the id along to the container.
        _containerInstance._id = id;
        // Emit when opening animation completes
        _containerInstance._animationStateChanged.pipe(filter(event => event.phaseName === 'done' && event.toState === 'enter'), take(1))
            .subscribe(() => {
            this._afterOpened.next();
            this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        _containerInstance._animationStateChanged.pipe(filter(event => event.phaseName === 'done' && event.toState === 'exit'), take(1)).subscribe(() => {
            clearTimeout(this._closeFallbackTimeout);
            this._finishDialogClose();
        });
        _overlayRef.detachments().subscribe(() => {
            this._beforeClosed.next(this._result);
            this._beforeClosed.complete();
            this._afterClosed.next(this._result);
            this._afterClosed.complete();
            this.componentInstance = null;
            this._overlayRef.dispose();
        });
        _overlayRef.keydownEvents()
            .pipe(filter(event => {
            return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
        }))
            .subscribe(event => {
            event.preventDefault();
            _closeDialogVia(this, 'keyboard');
        });
        _overlayRef.backdropClick().subscribe(() => {
            if (this.disableClose) {
                this._containerInstance._recaptureFocus();
            }
            else {
                _closeDialogVia(this, 'mouse');
            }
        });
    }
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    close(dialogResult) {
        this._result = dialogResult;
        // Transition the backdrop in parallel to the dialog.
        this._containerInstance._animationStateChanged.pipe(filter(event => event.phaseName === 'start'), take(1))
            .subscribe(event => {
            this._beforeClosed.next(dialogResult);
            this._beforeClosed.complete();
            this._overlayRef.detachBackdrop();
            // The logic that disposes of the overlay depends on the exit animation completing, however
            // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
            // timeout which will clean everything up if the animation hasn't fired within the specified
            // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
            // vast majority of cases the timeout will have been cleared before it has the chance to fire.
            this._closeFallbackTimeout = setTimeout(() => this._finishDialogClose(), event.totalTime + 100);
        });
        this._containerInstance._startExitAnimation();
        this._state = 1 /* CLOSING */;
    }
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     */
    afterOpened() {
        return this._afterOpened.asObservable();
    }
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    afterClosed() {
        return this._afterClosed.asObservable();
    }
    /**
     * Gets an observable that is notified when the dialog has started closing.
     */
    beforeClosed() {
        return this._beforeClosed.asObservable();
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick() {
        return this._overlayRef.backdropClick();
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents() {
        return this._overlayRef.keydownEvents();
    }
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position) {
        let strategy = this._getPositionStrategy();
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        this._overlayRef.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width = '', height = '') {
        this._getPositionStrategy().width(width).height(height);
        this._overlayRef.updatePosition();
        return this;
    }
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes) {
        this._overlayRef.addPanelClass(classes);
        return this;
    }
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes) {
        this._overlayRef.removePanelClass(classes);
        return this;
    }
    /** Gets the current state of the dialog's lifecycle. */
    getState() {
        return this._state;
    }
    /**
     * Finishes the dialog close by updating the state of the dialog
     * and disposing the overlay.
     */
    _finishDialogClose() {
        this._state = 2 /* CLOSED */;
        this._overlayRef.dispose();
    }
    /** Fetches the position strategy object from the overlay ref. */
    _getPositionStrategy() {
        return this._overlayRef.getConfig().positionStrategy;
    }
}
/**
 * Closes the dialog with the specified interaction type. This is currently not part of
 * `MatDialogRef` as that would conflict with custom dialog ref mocks provided in tests.
 * More details. See: https://github.com/angular/components/pull/9257#issuecomment-651342226.
 */
// TODO: TODO: Move this back into `MatDialogRef` when we provide an official mock dialog ref.
export function _closeDialogVia(ref, interactionType, result) {
    // Some mock dialog ref instances in tests do not have the `_containerInstance` property.
    // For those, we keep the behavior as is and do not deal with the interaction type.
    if (ref._containerInstance !== undefined) {
        ref._containerInstance._closeInteractionType = interactionType;
    }
    return ref.close(result);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTdELE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUs1QywyQkFBMkI7QUFFM0IsaUNBQWlDO0FBQ2pDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUtqQjs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBeUJ2QixZQUNVLFdBQXVCLEVBQ3hCLGtCQUFzQyxFQUNwQyxLQUFhLGNBQWMsUUFBUSxFQUFFLEVBQUU7UUFGeEMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDeEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNwQyxPQUFFLEdBQUYsRUFBRSxDQUFxQztRQXhCbEQsdURBQXVEO1FBQ3ZELGlCQUFZLEdBQXdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBRWpGLDJFQUEyRTtRQUMxRCxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFcEQsMkVBQTJFO1FBQzFELGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQWlCLENBQUM7UUFFN0QsMEVBQTBFO1FBQ3pELGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQWlCLENBQUM7UUFROUQsbUNBQW1DO1FBQzNCLFdBQU0sZ0JBQXVCO1FBT25DLHNDQUFzQztRQUN0QyxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRTVCLHdDQUF3QztRQUN4QyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQzVD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O0lBQ3hELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGtCQUFrQjtRQUN4QixJQUFJLENBQUMsTUFBTSxpQkFBd0IsQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxpRUFBaUU7SUFDekQsb0JBQW9CO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxnQkFBMEMsQ0FBQztJQUNqRixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsOEZBQThGO0FBQzlGLE1BQU0sVUFBVSxlQUFlLENBQUksR0FBb0IsRUFBRSxlQUE0QixFQUFFLE1BQVU7SUFDL0YseUZBQXlGO0lBQ3pGLG1GQUFtRjtJQUNuRixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsS0FBSyxTQUFTLEVBQUU7UUFDeEMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLGVBQWUsQ0FBQztLQUNoRTtJQUNELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7R2xvYmFsUG9zaXRpb25TdHJhdGVneSwgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0RpYWxvZ1Bvc2l0aW9ufSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuaW1wb3J0IHtNYXREaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5cblxuLy8gVE9ETyhqZWxib3Vybik6IHJlc2l6aW5nXG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBkaWFsb2cgaWRzLlxubGV0IHVuaXF1ZUlkID0gMDtcblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBvZiB0aGUgbGlmZWN5Y2xlIG9mIGEgZGlhbG9nLiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gTWF0RGlhbG9nU3RhdGUge09QRU4sIENMT1NJTkcsIENMT1NFRH1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSBkaWFsb2cgb3BlbmVkIHZpYSB0aGUgTWF0RGlhbG9nIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dSZWY8VCwgUiA9IGFueT4ge1xuICAvKiogVGhlIGluc3RhbmNlIG9mIGNvbXBvbmVudCBvcGVuZWQgaW50byB0aGUgZGlhbG9nLiAqL1xuICBjb21wb25lbnRJbnN0YW5jZTogVDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBhbGxvd2VkIHRvIGNsb3NlIHRoZSBkaWFsb2cuICovXG4gIGRpc2FibGVDbG9zZTogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9jb25maWcuZGlzYWJsZUNsb3NlO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgZGlhbG9nIGhhcyBmaW5pc2hlZCBvcGVuaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBkaWFsb2cgaGFzIGZpbmlzaGVkIGNsb3NpbmcuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyQ2xvc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRpYWxvZyBoYXMgc3RhcnRlZCBjbG9zaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9iZWZvcmVDbG9zZWQgPSBuZXcgU3ViamVjdDxSIHwgdW5kZWZpbmVkPigpO1xuXG4gIC8qKiBSZXN1bHQgdG8gYmUgcGFzc2VkIHRvIGFmdGVyQ2xvc2VkLiAqL1xuICBwcml2YXRlIF9yZXN1bHQ6IFIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEhhbmRsZSB0byB0aGUgdGltZW91dCB0aGF0J3MgcnVubmluZyBhcyBhIGZhbGxiYWNrIGluIGNhc2UgdGhlIGV4aXQgYW5pbWF0aW9uIGRvZXNuJ3QgZmlyZS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VGYWxsYmFja1RpbWVvdXQ6IG51bWJlcjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLk9QRU47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBwdWJsaWMgX2NvbnRhaW5lckluc3RhbmNlOiBNYXREaWFsb2dDb250YWluZXIsXG4gICAgcmVhZG9ubHkgaWQ6IHN0cmluZyA9IGBtYXQtZGlhbG9nLSR7dW5pcXVlSWQrK31gKSB7XG5cbiAgICAvLyBQYXNzIHRoZSBpZCBhbG9uZyB0byB0aGUgY29udGFpbmVyLlxuICAgIF9jb250YWluZXJJbnN0YW5jZS5faWQgPSBpZDtcblxuICAgIC8vIEVtaXQgd2hlbiBvcGVuaW5nIGFuaW1hdGlvbiBjb21wbGV0ZXNcbiAgICBfY29udGFpbmVySW5zdGFuY2UuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicpLFxuICAgICAgdGFrZSgxKVxuICAgIClcbiAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLm5leHQoKTtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNwb3NlIG92ZXJsYXkgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuICAgIF9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnZG9uZScgJiYgZXZlbnQudG9TdGF0ZSA9PT0gJ2V4aXQnKSxcbiAgICAgIHRha2UoMSlcbiAgICApLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQpO1xuICAgICAgdGhpcy5fZmluaXNoRGlhbG9nQ2xvc2UoKTtcbiAgICB9KTtcblxuICAgIF9vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5uZXh0KHRoaXMuX3Jlc3VsdCk7XG4gICAgICB0aGlzLl9iZWZvcmVDbG9zZWQuY29tcGxldGUoKTtcbiAgICAgIHRoaXMuX2FmdGVyQ2xvc2VkLm5leHQodGhpcy5fcmVzdWx0KTtcbiAgICAgIHRoaXMuX2FmdGVyQ2xvc2VkLmNvbXBsZXRlKCk7XG4gICAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gbnVsbCE7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICB9KTtcblxuICAgIF9vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKVxuICAgICAgLnBpcGUoZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhdGhpcy5kaXNhYmxlQ2xvc2UgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KTtcbiAgICAgIH0pKVxuICAgICAgLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF9jbG9zZURpYWxvZ1ZpYSh0aGlzLCAna2V5Ym9hcmQnKTtcbiAgICAgIH0pO1xuXG4gICAgX292ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbmVySW5zdGFuY2UuX3JlY2FwdHVyZUZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY2xvc2VEaWFsb2dWaWEodGhpcywgJ21vdXNlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGRpYWxvZ1Jlc3VsdCBPcHRpb25hbCByZXN1bHQgdG8gcmV0dXJuIHRvIHRoZSBkaWFsb2cgb3BlbmVyLlxuICAgKi9cbiAgY2xvc2UoZGlhbG9nUmVzdWx0PzogUik6IHZvaWQge1xuICAgIHRoaXMuX3Jlc3VsdCA9IGRpYWxvZ1Jlc3VsdDtcblxuICAgIC8vIFRyYW5zaXRpb24gdGhlIGJhY2tkcm9wIGluIHBhcmFsbGVsIHRvIHRoZSBkaWFsb2cuXG4gICAgdGhpcy5fY29udGFpbmVySW5zdGFuY2UuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ3N0YXJ0JyksXG4gICAgICB0YWtlKDEpXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLm5leHQoZGlhbG9nUmVzdWx0KTtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2hCYWNrZHJvcCgpO1xuXG4gICAgICAvLyBUaGUgbG9naWMgdGhhdCBkaXNwb3NlcyBvZiB0aGUgb3ZlcmxheSBkZXBlbmRzIG9uIHRoZSBleGl0IGFuaW1hdGlvbiBjb21wbGV0aW5nLCBob3dldmVyXG4gICAgICAvLyBpdCBpc24ndCBndWFyYW50ZWVkIGlmIHRoZSBwYXJlbnQgdmlldyBpcyBkZXN0cm95ZWQgd2hpbGUgaXQncyBydW5uaW5nLiBBZGQgYSBmYWxsYmFja1xuICAgICAgLy8gdGltZW91dCB3aGljaCB3aWxsIGNsZWFuIGV2ZXJ5dGhpbmcgdXAgaWYgdGhlIGFuaW1hdGlvbiBoYXNuJ3QgZmlyZWQgd2l0aGluIHRoZSBzcGVjaWZpZWRcbiAgICAgIC8vIGFtb3VudCBvZiB0aW1lIHBsdXMgMTAwbXMuIFdlIGRvbid0IG5lZWQgdG8gcnVuIHRoaXMgb3V0c2lkZSB0aGUgTmdab25lLCBiZWNhdXNlIGZvciB0aGVcbiAgICAgIC8vIHZhc3QgbWFqb3JpdHkgb2YgY2FzZXMgdGhlIHRpbWVvdXQgd2lsbCBoYXZlIGJlZW4gY2xlYXJlZCBiZWZvcmUgaXQgaGFzIHRoZSBjaGFuY2UgdG8gZmlyZS5cbiAgICAgIHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLl9maW5pc2hEaWFsb2dDbG9zZSgpLFxuICAgICAgICAgIGV2ZW50LnRvdGFsVGltZSArIDEwMCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb250YWluZXJJbnN0YW5jZS5fc3RhcnRFeGl0QW5pbWF0aW9uKCk7XG4gICAgdGhpcy5fc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5DTE9TSU5HO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBvcGVuaW5nLlxuICAgKi9cbiAgYWZ0ZXJPcGVuZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FmdGVyT3BlbmVkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBjbG9zaW5nLlxuICAgKi9cbiAgYWZ0ZXJDbG9zZWQoKTogT2JzZXJ2YWJsZTxSIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FmdGVyQ2xvc2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBoYXMgc3RhcnRlZCBjbG9zaW5nLlxuICAgKi9cbiAgYmVmb3JlQ2xvc2VkKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLl9iZWZvcmVDbG9zZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgb3ZlcmxheSdzIGJhY2tkcm9wIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAqL1xuICBiYWNrZHJvcENsaWNrKCk6IE9ic2VydmFibGU8TW91c2VFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGtleWRvd24gZXZlbnRzIGFyZSB0YXJnZXRlZCBvbiB0aGUgb3ZlcmxheS5cbiAgICovXG4gIGtleWRvd25FdmVudHMoKTogT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zaXRpb24gTmV3IGRpYWxvZyBwb3NpdGlvbi5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uPzogRGlhbG9nUG9zaXRpb24pOiB0aGlzIHtcbiAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLl9nZXRQb3NpdGlvblN0cmF0ZWd5KCk7XG5cbiAgICBpZiAocG9zaXRpb24gJiYgKHBvc2l0aW9uLmxlZnQgfHwgcG9zaXRpb24ucmlnaHQpKSB7XG4gICAgICBwb3NpdGlvbi5sZWZ0ID8gc3RyYXRlZ3kubGVmdChwb3NpdGlvbi5sZWZ0KSA6IHN0cmF0ZWd5LnJpZ2h0KHBvc2l0aW9uLnJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyYXRlZ3kuY2VudGVySG9yaXpvbnRhbGx5KCk7XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uICYmIChwb3NpdGlvbi50b3AgfHwgcG9zaXRpb24uYm90dG9tKSkge1xuICAgICAgcG9zaXRpb24udG9wID8gc3RyYXRlZ3kudG9wKHBvc2l0aW9uLnRvcCkgOiBzdHJhdGVneS5ib3R0b20ocG9zaXRpb24uYm90dG9tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyYXRlZ3kuY2VudGVyVmVydGljYWxseSgpO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHdpZHRoIGFuZCBoZWlnaHQuXG4gICAqIEBwYXJhbSB3aWR0aCBOZXcgd2lkdGggb2YgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGhlaWdodCBOZXcgaGVpZ2h0IG9mIHRoZSBkaWFsb2cuXG4gICAqL1xuICB1cGRhdGVTaXplKHdpZHRoOiBzdHJpbmcgPSAnJywgaGVpZ2h0OiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMuX2dldFBvc2l0aW9uU3RyYXRlZ3koKS53aWR0aCh3aWR0aCkuaGVpZ2h0KGhlaWdodCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEFkZCBhIENTUyBjbGFzcyBvciBhbiBhcnJheSBvZiBjbGFzc2VzIHRvIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIGFkZFBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10pOiB0aGlzIHtcbiAgICB0aGlzLl9vdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmVtb3ZlIGEgQ1NTIGNsYXNzIG9yIGFuIGFycmF5IG9mIGNsYXNzZXMgZnJvbSB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICByZW1vdmVQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5yZW1vdmVQYW5lbENsYXNzKGNsYXNzZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRpYWxvZydzIGxpZmVjeWNsZS4gKi9cbiAgZ2V0U3RhdGUoKTogTWF0RGlhbG9nU3RhdGUge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5pc2hlcyB0aGUgZGlhbG9nIGNsb3NlIGJ5IHVwZGF0aW5nIHRoZSBzdGF0ZSBvZiB0aGUgZGlhbG9nXG4gICAqIGFuZCBkaXNwb3NpbmcgdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9maW5pc2hEaWFsb2dDbG9zZSgpIHtcbiAgICB0aGlzLl9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLkNMT1NFRDtcbiAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8qKiBGZXRjaGVzIHRoZSBwb3NpdGlvbiBzdHJhdGVneSBvYmplY3QgZnJvbSB0aGUgb3ZlcmxheSByZWYuICovXG4gIHByaXZhdGUgX2dldFBvc2l0aW9uU3RyYXRlZ3koKTogR2xvYmFsUG9zaXRpb25TdHJhdGVneSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneSBhcyBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5O1xuICB9XG59XG5cbi8qKlxuICogQ2xvc2VzIHRoZSBkaWFsb2cgd2l0aCB0aGUgc3BlY2lmaWVkIGludGVyYWN0aW9uIHR5cGUuIFRoaXMgaXMgY3VycmVudGx5IG5vdCBwYXJ0IG9mXG4gKiBgTWF0RGlhbG9nUmVmYCBhcyB0aGF0IHdvdWxkIGNvbmZsaWN0IHdpdGggY3VzdG9tIGRpYWxvZyByZWYgbW9ja3MgcHJvdmlkZWQgaW4gdGVzdHMuXG4gKiBNb3JlIGRldGFpbHMuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzkyNTcjaXNzdWVjb21tZW50LTY1MTM0MjIyNi5cbiAqL1xuLy8gVE9ETzogVE9ETzogTW92ZSB0aGlzIGJhY2sgaW50byBgTWF0RGlhbG9nUmVmYCB3aGVuIHdlIHByb3ZpZGUgYW4gb2ZmaWNpYWwgbW9jayBkaWFsb2cgcmVmLlxuZXhwb3J0IGZ1bmN0aW9uIF9jbG9zZURpYWxvZ1ZpYTxSPihyZWY6IE1hdERpYWxvZ1JlZjxSPiwgaW50ZXJhY3Rpb25UeXBlOiBGb2N1c09yaWdpbiwgcmVzdWx0PzogUikge1xuICAvLyBTb21lIG1vY2sgZGlhbG9nIHJlZiBpbnN0YW5jZXMgaW4gdGVzdHMgZG8gbm90IGhhdmUgdGhlIGBfY29udGFpbmVySW5zdGFuY2VgIHByb3BlcnR5LlxuICAvLyBGb3IgdGhvc2UsIHdlIGtlZXAgdGhlIGJlaGF2aW9yIGFzIGlzIGFuZCBkbyBub3QgZGVhbCB3aXRoIHRoZSBpbnRlcmFjdGlvbiB0eXBlLlxuICBpZiAocmVmLl9jb250YWluZXJJbnN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVmLl9jb250YWluZXJJbnN0YW5jZS5fY2xvc2VJbnRlcmFjdGlvblR5cGUgPSBpbnRlcmFjdGlvblR5cGU7XG4gIH1cbiAgcmV0dXJuIHJlZi5jbG9zZShyZXN1bHQpO1xufVxuIl19