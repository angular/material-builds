/**
 * @fileoverview added by tsickle
 * Generated from: src/material/dialog/dialog-ref.ts
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
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
// TODO(jelbourn): resizing
// Counter for unique dialog ids.
/** @type {?} */
let uniqueId = 0;
/** @enum {number} */
const MatDialogState = {
    OPEN: 0, CLOSING: 1, CLOSED: 2,
};
export { MatDialogState };
/**
 * Reference to a dialog opened via the MatDialog service.
 * @template T, R
 */
export class MatDialogRef {
    /**
     * @param {?} _overlayRef
     * @param {?} _containerInstance
     * @param {?=} id
     */
    constructor(_overlayRef, _containerInstance, id = `mat-dialog-${uniqueId++}`) {
        this._overlayRef = _overlayRef;
        this._containerInstance = _containerInstance;
        this.id = id;
        /**
         * Whether the user is allowed to close the dialog.
         */
        this.disableClose = this._containerInstance._config.disableClose;
        /**
         * Subject for notifying the user that the dialog has finished opening.
         */
        this._afterOpened = new Subject();
        /**
         * Subject for notifying the user that the dialog has finished closing.
         */
        this._afterClosed = new Subject();
        /**
         * Subject for notifying the user that the dialog has started closing.
         */
        this._beforeClosed = new Subject();
        /**
         * Current state of the dialog.
         */
        this._state = 0 /* OPEN */;
        // Pass the id along to the container.
        _containerInstance._id = id;
        // Emit when opening animation completes
        _containerInstance._animationStateChanged.pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.phaseName === 'done' && event.toState === 'enter')), take(1))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._afterOpened.next();
            this._afterOpened.complete();
        }));
        // Dispose overlay when closing animation is complete
        _containerInstance._animationStateChanged.pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.phaseName === 'done' && event.toState === 'exit')), take(1)).subscribe((/**
         * @return {?}
         */
        () => {
            clearTimeout(this._closeFallbackTimeout);
            this._overlayRef.dispose();
        }));
        _overlayRef.detachments().subscribe((/**
         * @return {?}
         */
        () => {
            this._beforeClosed.next(this._result);
            this._beforeClosed.complete();
            this._afterClosed.next(this._result);
            this._afterClosed.complete();
            this.componentInstance = (/** @type {?} */ (null));
            this._overlayRef.dispose();
        }));
        _overlayRef.keydownEvents()
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
        })))
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            event.preventDefault();
            this.close();
        }));
        _overlayRef.backdropClick().subscribe((/**
         * @return {?}
         */
        () => {
            if (this.disableClose) {
                this._containerInstance._recaptureFocus();
            }
            else {
                this.close();
            }
        }));
    }
    /**
     * Close the dialog.
     * @param {?=} dialogResult Optional result to return to the dialog opener.
     * @return {?}
     */
    close(dialogResult) {
        this._result = dialogResult;
        // Transition the backdrop in parallel to the dialog.
        this._containerInstance._animationStateChanged.pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.phaseName === 'start')), take(1))
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            this._beforeClosed.next(dialogResult);
            this._beforeClosed.complete();
            this._state = 2 /* CLOSED */;
            this._overlayRef.detachBackdrop();
            // The logic that disposes of the overlay depends on the exit animation completing, however
            // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
            // timeout which will clean everything up if the animation hasn't fired within the specified
            // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
            // vast majority of cases the timeout will have been cleared before it has the chance to fire.
            this._closeFallbackTimeout = setTimeout((/**
             * @return {?}
             */
            () => {
                this._overlayRef.dispose();
            }), event.totalTime + 100);
        }));
        this._containerInstance._startExitAnimation();
        this._state = 1 /* CLOSING */;
    }
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     * @return {?}
     */
    afterOpened() {
        return this._afterOpened.asObservable();
    }
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     * @return {?}
     */
    afterClosed() {
        return this._afterClosed.asObservable();
    }
    /**
     * Gets an observable that is notified when the dialog has started closing.
     * @return {?}
     */
    beforeClosed() {
        return this._beforeClosed.asObservable();
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
    /**
     * Updates the dialog's position.
     * @template THIS
     * @this {THIS}
     * @param {?=} position New dialog position.
     * @return {THIS}
     */
    updatePosition(position) {
        /** @type {?} */
        let strategy = (/** @type {?} */ (this))._getPositionStrategy();
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
        (/** @type {?} */ (this))._overlayRef.updatePosition();
        return (/** @type {?} */ (this));
    }
    /**
     * Updates the dialog's width and height.
     * @template THIS
     * @this {THIS}
     * @param {?=} width New width of the dialog.
     * @param {?=} height New height of the dialog.
     * @return {THIS}
     */
    updateSize(width = '', height = '') {
        (/** @type {?} */ (this))._getPositionStrategy().width(width).height(height);
        (/** @type {?} */ (this))._overlayRef.updatePosition();
        return (/** @type {?} */ (this));
    }
    /**
     * Add a CSS class or an array of classes to the overlay pane.
     * @template THIS
     * @this {THIS}
     * @param {?} classes
     * @return {THIS}
     */
    addPanelClass(classes) {
        (/** @type {?} */ (this))._overlayRef.addPanelClass(classes);
        return (/** @type {?} */ (this));
    }
    /**
     * Remove a CSS class or an array of classes from the overlay pane.
     * @template THIS
     * @this {THIS}
     * @param {?} classes
     * @return {THIS}
     */
    removePanelClass(classes) {
        (/** @type {?} */ (this))._overlayRef.removePanelClass(classes);
        return (/** @type {?} */ (this));
    }
    /**
     * Gets the current state of the dialog's lifecycle.
     * @return {?}
     */
    getState() {
        return this._state;
    }
    /**
     * Fetches the position strategy object from the overlay ref.
     * @private
     * @return {?}
     */
    _getPositionStrategy() {
        return (/** @type {?} */ (this._overlayRef.getConfig().positionStrategy));
    }
}
if (false) {
    /**
     * The instance of component opened into the dialog.
     * @type {?}
     */
    MatDialogRef.prototype.componentInstance;
    /**
     * Whether the user is allowed to close the dialog.
     * @type {?}
     */
    MatDialogRef.prototype.disableClose;
    /**
     * Subject for notifying the user that the dialog has finished opening.
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._afterOpened;
    /**
     * Subject for notifying the user that the dialog has finished closing.
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._afterClosed;
    /**
     * Subject for notifying the user that the dialog has started closing.
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._beforeClosed;
    /**
     * Result to be passed to afterClosed.
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._result;
    /**
     * Handle to the timeout that's running as a fallback in case the exit animation doesn't fire.
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._closeFallbackTimeout;
    /**
     * Current state of the dialog.
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._state;
    /**
     * @type {?}
     * @private
     */
    MatDialogRef.prototype._overlayRef;
    /** @type {?} */
    MatDialogRef.prototype._containerInstance;
    /** @type {?} */
    MatDialogRef.prototype.id;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTdELE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztJQVF4QyxRQUFRLEdBQUcsQ0FBQzs7QUFHaEIsTUFBa0IsY0FBYztJQUFFLElBQUksR0FBQSxFQUFFLE9BQU8sR0FBQSxFQUFFLE1BQU0sR0FBQTtFQUFDOzs7Ozs7QUFLeEQsTUFBTSxPQUFPLFlBQVk7Ozs7OztJQXlCdkIsWUFDVSxXQUF1QixFQUN4QixrQkFBc0MsRUFDcEMsS0FBYSxjQUFjLFFBQVEsRUFBRSxFQUFFO1FBRnhDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3hCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDcEMsT0FBRSxHQUFGLEVBQUUsQ0FBcUM7Ozs7UUF2QmxELGlCQUFZLEdBQXdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDOzs7O1FBR2hFLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7OztRQUduQyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDOzs7O1FBRzVDLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQWlCLENBQUM7Ozs7UUFTdEQsV0FBTSxnQkFBdUI7UUFPbkMsc0NBQXNDO1FBQ3RDLGtCQUFrQixDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFNUIsd0NBQXdDO1FBQ3hDLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FDNUMsTUFBTTs7OztRQUFDLEtBQUss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LEVBQUEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsT0FBTyxtQkFBQSxJQUFJLEVBQUEsQ0FBQztJQUNkLENBQUM7Ozs7O0lBR0QsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOzs7Ozs7SUFHTyxvQkFBb0I7UUFDMUIsT0FBTyxtQkFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixFQUEwQixDQUFDO0lBQ2pGLENBQUM7Q0FDRjs7Ozs7O0lBeE1DLHlDQUFxQjs7Ozs7SUFHckIsb0NBQWlGOzs7Ozs7SUFHakYsb0NBQW9EOzs7Ozs7SUFHcEQsb0NBQTZEOzs7Ozs7SUFHN0QscUNBQThEOzs7Ozs7SUFHOUQsK0JBQStCOzs7Ozs7SUFHL0IsNkNBQXNDOzs7Ozs7SUFHdEMsOEJBQXFDOzs7OztJQUduQyxtQ0FBK0I7O0lBQy9CLDBDQUE2Qzs7SUFDN0MsMEJBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7R2xvYmFsUG9zaXRpb25TdHJhdGVneSwgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0RpYWxvZ1Bvc2l0aW9ufSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuaW1wb3J0IHtNYXREaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5cblxuLy8gVE9ETyhqZWxib3Vybik6IHJlc2l6aW5nXG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBkaWFsb2cgaWRzLlxubGV0IHVuaXF1ZUlkID0gMDtcblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBvZiB0aGUgbGlmZWN5Y2xlIG9mIGEgZGlhbG9nLiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gTWF0RGlhbG9nU3RhdGUge09QRU4sIENMT1NJTkcsIENMT1NFRH1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSBkaWFsb2cgb3BlbmVkIHZpYSB0aGUgTWF0RGlhbG9nIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dSZWY8VCwgUiA9IGFueT4ge1xuICAvKiogVGhlIGluc3RhbmNlIG9mIGNvbXBvbmVudCBvcGVuZWQgaW50byB0aGUgZGlhbG9nLiAqL1xuICBjb21wb25lbnRJbnN0YW5jZTogVDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBhbGxvd2VkIHRvIGNsb3NlIHRoZSBkaWFsb2cuICovXG4gIGRpc2FibGVDbG9zZTogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9jb25maWcuZGlzYWJsZUNsb3NlO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgZGlhbG9nIGhhcyBmaW5pc2hlZCBvcGVuaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBkaWFsb2cgaGFzIGZpbmlzaGVkIGNsb3NpbmcuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyQ2xvc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRpYWxvZyBoYXMgc3RhcnRlZCBjbG9zaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9iZWZvcmVDbG9zZWQgPSBuZXcgU3ViamVjdDxSIHwgdW5kZWZpbmVkPigpO1xuXG4gIC8qKiBSZXN1bHQgdG8gYmUgcGFzc2VkIHRvIGFmdGVyQ2xvc2VkLiAqL1xuICBwcml2YXRlIF9yZXN1bHQ6IFIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEhhbmRsZSB0byB0aGUgdGltZW91dCB0aGF0J3MgcnVubmluZyBhcyBhIGZhbGxiYWNrIGluIGNhc2UgdGhlIGV4aXQgYW5pbWF0aW9uIGRvZXNuJ3QgZmlyZS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VGYWxsYmFja1RpbWVvdXQ6IG51bWJlcjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLk9QRU47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBwdWJsaWMgX2NvbnRhaW5lckluc3RhbmNlOiBNYXREaWFsb2dDb250YWluZXIsXG4gICAgcmVhZG9ubHkgaWQ6IHN0cmluZyA9IGBtYXQtZGlhbG9nLSR7dW5pcXVlSWQrK31gKSB7XG5cbiAgICAvLyBQYXNzIHRoZSBpZCBhbG9uZyB0byB0aGUgY29udGFpbmVyLlxuICAgIF9jb250YWluZXJJbnN0YW5jZS5faWQgPSBpZDtcblxuICAgIC8vIEVtaXQgd2hlbiBvcGVuaW5nIGFuaW1hdGlvbiBjb21wbGV0ZXNcbiAgICBfY29udGFpbmVySW5zdGFuY2UuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicpLFxuICAgICAgdGFrZSgxKVxuICAgIClcbiAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLm5leHQoKTtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNwb3NlIG92ZXJsYXkgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuICAgIF9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnZG9uZScgJiYgZXZlbnQudG9TdGF0ZSA9PT0gJ2V4aXQnKSxcbiAgICAgIHRha2UoMSlcbiAgICApLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgfSk7XG5cbiAgICBfb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9iZWZvcmVDbG9zZWQubmV4dCh0aGlzLl9yZXN1bHQpO1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLmNvbXBsZXRlKCk7XG4gICAgICB0aGlzLl9hZnRlckNsb3NlZC5uZXh0KHRoaXMuX3Jlc3VsdCk7XG4gICAgICB0aGlzLl9hZnRlckNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IG51bGwhO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgfSk7XG5cbiAgICBfb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKClcbiAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgIHJldHVybiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIXRoaXMuZGlzYWJsZUNsb3NlICYmICFoYXNNb2RpZmllcktleShldmVudCk7XG4gICAgICB9KSlcbiAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcblxuICAgIF9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZUNsb3NlKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9yZWNhcHR1cmVGb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIHRoZSBkaWFsb2cuXG4gICAqIEBwYXJhbSBkaWFsb2dSZXN1bHQgT3B0aW9uYWwgcmVzdWx0IHRvIHJldHVybiB0byB0aGUgZGlhbG9nIG9wZW5lci5cbiAgICovXG4gIGNsb3NlKGRpYWxvZ1Jlc3VsdD86IFIpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXN1bHQgPSBkaWFsb2dSZXN1bHQ7XG5cbiAgICAvLyBUcmFuc2l0aW9uIHRoZSBiYWNrZHJvcCBpbiBwYXJhbGxlbCB0byB0aGUgZGlhbG9nLlxuICAgIHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQucGlwZShcbiAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC5waGFzZU5hbWUgPT09ICdzdGFydCcpLFxuICAgICAgdGFrZSgxKVxuICAgIClcbiAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5uZXh0KGRpYWxvZ1Jlc3VsdCk7XG4gICAgICB0aGlzLl9iZWZvcmVDbG9zZWQuY29tcGxldGUoKTtcbiAgICAgIHRoaXMuX3N0YXRlID0gTWF0RGlhbG9nU3RhdGUuQ0xPU0VEO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2hCYWNrZHJvcCgpO1xuXG4gICAgICAvLyBUaGUgbG9naWMgdGhhdCBkaXNwb3NlcyBvZiB0aGUgb3ZlcmxheSBkZXBlbmRzIG9uIHRoZSBleGl0IGFuaW1hdGlvbiBjb21wbGV0aW5nLCBob3dldmVyXG4gICAgICAvLyBpdCBpc24ndCBndWFyYW50ZWVkIGlmIHRoZSBwYXJlbnQgdmlldyBpcyBkZXN0cm95ZWQgd2hpbGUgaXQncyBydW5uaW5nLiBBZGQgYSBmYWxsYmFja1xuICAgICAgLy8gdGltZW91dCB3aGljaCB3aWxsIGNsZWFuIGV2ZXJ5dGhpbmcgdXAgaWYgdGhlIGFuaW1hdGlvbiBoYXNuJ3QgZmlyZWQgd2l0aGluIHRoZSBzcGVjaWZpZWRcbiAgICAgIC8vIGFtb3VudCBvZiB0aW1lIHBsdXMgMTAwbXMuIFdlIGRvbid0IG5lZWQgdG8gcnVuIHRoaXMgb3V0c2lkZSB0aGUgTmdab25lLCBiZWNhdXNlIGZvciB0aGVcbiAgICAgIC8vIHZhc3QgbWFqb3JpdHkgb2YgY2FzZXMgdGhlIHRpbWVvdXQgd2lsbCBoYXZlIGJlZW4gY2xlYXJlZCBiZWZvcmUgaXQgaGFzIHRoZSBjaGFuY2UgdG8gZmlyZS5cbiAgICAgIHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgfSwgZXZlbnQudG90YWxUaW1lICsgMTAwKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9zdGFydEV4aXRBbmltYXRpb24oKTtcbiAgICB0aGlzLl9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLkNMT1NJTkc7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgZGlhbG9nIGlzIGZpbmlzaGVkIG9wZW5pbmcuXG4gICAqL1xuICBhZnRlck9wZW5lZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJPcGVuZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgZGlhbG9nIGlzIGZpbmlzaGVkIGNsb3NpbmcuXG4gICAqL1xuICBhZnRlckNsb3NlZCgpOiBPYnNlcnZhYmxlPFIgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJDbG9zZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgZGlhbG9nIGhhcyBzdGFydGVkIGNsb3NpbmcuXG4gICAqL1xuICBiZWZvcmVDbG9zZWQoKTogT2JzZXJ2YWJsZTxSIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2JlZm9yZUNsb3NlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBvdmVybGF5J3MgYmFja2Ryb3AgaGFzIGJlZW4gY2xpY2tlZC5cbiAgICovXG4gIGJhY2tkcm9wQ2xpY2soKTogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4ga2V5ZG93biBldmVudHMgYXJlIHRhcmdldGVkIG9uIHRoZSBvdmVybGF5LlxuICAgKi9cbiAga2V5ZG93bkV2ZW50cygpOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlhbG9nJ3MgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBOZXcgZGlhbG9nIHBvc2l0aW9uLlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24ocG9zaXRpb24/OiBEaWFsb2dQb3NpdGlvbik6IHRoaXMge1xuICAgIGxldCBzdHJhdGVneSA9IHRoaXMuX2dldFBvc2l0aW9uU3RyYXRlZ3koKTtcblxuICAgIGlmIChwb3NpdGlvbiAmJiAocG9zaXRpb24ubGVmdCB8fCBwb3NpdGlvbi5yaWdodCkpIHtcbiAgICAgIHBvc2l0aW9uLmxlZnQgPyBzdHJhdGVneS5sZWZ0KHBvc2l0aW9uLmxlZnQpIDogc3RyYXRlZ3kucmlnaHQocG9zaXRpb24ucmlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gJiYgKHBvc2l0aW9uLnRvcCB8fCBwb3NpdGlvbi5ib3R0b20pKSB7XG4gICAgICBwb3NpdGlvbi50b3AgPyBzdHJhdGVneS50b3AocG9zaXRpb24udG9wKSA6IHN0cmF0ZWd5LmJvdHRvbShwb3NpdGlvbi5ib3R0b20pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJhdGVneS5jZW50ZXJWZXJ0aWNhbGx5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlhbG9nJ3Mgd2lkdGggYW5kIGhlaWdodC5cbiAgICogQHBhcmFtIHdpZHRoIE5ldyB3aWR0aCBvZiB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gaGVpZ2h0IE5ldyBoZWlnaHQgb2YgdGhlIGRpYWxvZy5cbiAgICovXG4gIHVwZGF0ZVNpemUod2lkdGg6IHN0cmluZyA9ICcnLCBoZWlnaHQ6IHN0cmluZyA9ICcnKTogdGhpcyB7XG4gICAgdGhpcy5fZ2V0UG9zaXRpb25TdHJhdGVneSgpLndpZHRoKHdpZHRoKS5oZWlnaHQoaGVpZ2h0KTtcbiAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogQWRkIGEgQ1NTIGNsYXNzIG9yIGFuIGFycmF5IG9mIGNsYXNzZXMgdG8gdGhlIG92ZXJsYXkgcGFuZS4gKi9cbiAgYWRkUGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHRoaXMge1xuICAgIHRoaXMuX292ZXJsYXlSZWYuYWRkUGFuZWxDbGFzcyhjbGFzc2VzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBSZW1vdmUgYSBDU1MgY2xhc3Mgb3IgYW4gYXJyYXkgb2YgY2xhc3NlcyBmcm9tIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIHJlbW92ZVBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10pOiB0aGlzIHtcbiAgICB0aGlzLl9vdmVybGF5UmVmLnJlbW92ZVBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZGlhbG9nJ3MgbGlmZWN5Y2xlLiAqL1xuICBnZXRTdGF0ZSgpOiBNYXREaWFsb2dTdGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqIEZldGNoZXMgdGhlIHBvc2l0aW9uIHN0cmF0ZWd5IG9iamVjdCBmcm9tIHRoZSBvdmVybGF5IHJlZi4gKi9cbiAgcHJpdmF0ZSBfZ2V0UG9zaXRpb25TdHJhdGVneSgpOiBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZi5nZXRDb25maWcoKS5wb3NpdGlvblN0cmF0ZWd5IGFzIEdsb2JhbFBvc2l0aW9uU3RyYXRlZ3k7XG4gIH1cbn1cbiJdfQ==