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
     * @param {?=} _location
     * @param {?=} id
     */
    constructor(_overlayRef, _containerInstance, 
    // @breaking-change 8.0.0 `_location` parameter to be removed.
    _location, id = `mat-dialog-${uniqueId++}`) {
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
     * Gets an observable that is notified when the dialog is finished opening.
     * @deprecated Use `afterOpened` instead.
     * \@breaking-change 8.0.0
     * @return {?}
     */
    afterOpen() {
        return this.afterOpened();
    }
    /**
     * Gets an observable that is notified when the dialog has started closing.
     * @deprecated Use `beforeClosed` instead.
     * \@breaking-change 8.0.0
     * @return {?}
     */
    beforeClose() {
        return this.beforeClosed();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHN0QsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7O0lBUXhDLFFBQVEsR0FBRyxDQUFDOzs7SUFHa0IsT0FBSSxFQUFFLFVBQU8sRUFBRSxTQUFNOzs7Ozs7O0FBS3ZELE1BQU0sT0FBTyxZQUFZOzs7Ozs7O0lBeUJ2QixZQUNVLFdBQXVCLEVBQ3hCLGtCQUFzQztJQUM3Qyw4REFBOEQ7SUFDOUQsU0FBb0IsRUFDWCxLQUFhLGNBQWMsUUFBUSxFQUFFLEVBQUU7UUFKeEMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDeEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUdwQyxPQUFFLEdBQUYsRUFBRSxDQUFxQzs7OztRQXpCbEQsaUJBQVksR0FBd0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7Ozs7UUFHaEUsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7O1FBR25DLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQWlCLENBQUM7Ozs7UUFHNUMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQzs7OztRQVN0RCxXQUFNLGdCQUF1QjtRQVNuQyxzQ0FBc0M7UUFDdEMsa0JBQWtCLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUU1Qix3Q0FBd0M7UUFDeEMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUM1QyxNQUFNOzs7O1FBQUMsS0FBSyxDQUFDLEVBQUUs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QzdCLENBQUM7Ozs7O0lBR0QsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOzs7Ozs7SUFHTyxvQkFBb0I7UUFDMUIsT0FBTyxtQkFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixFQUEwQixDQUFDO0lBQ2pGLENBQUM7Q0FDRjs7Ozs7O0lBcE5DLHlDQUFxQjs7Ozs7SUFHckIsb0NBQWlGOzs7Ozs7SUFHakYsb0NBQW9EOzs7Ozs7SUFHcEQsb0NBQTZEOzs7Ozs7SUFHN0QscUNBQThEOzs7Ozs7SUFHOUQsK0JBQStCOzs7Ozs7SUFHL0IsNkNBQXNDOzs7Ozs7SUFHdEMsOEJBQXFDOzs7OztJQUduQyxtQ0FBK0I7O0lBQy9CLDBDQUE2Qzs7SUFHN0MsMEJBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7R2xvYmFsUG9zaXRpb25TdHJhdGVneSwgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtEaWFsb2dQb3NpdGlvbn0gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuXG5cbi8vIFRPRE8oamVsYm91cm4pOiByZXNpemluZ1xuXG4vLyBDb3VudGVyIGZvciB1bmlxdWUgZGlhbG9nIGlkcy5cbmxldCB1bmlxdWVJZCA9IDA7XG5cbi8qKiBQb3NzaWJsZSBzdGF0ZXMgb2YgdGhlIGxpZmVjeWNsZSBvZiBhIGRpYWxvZy4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE1hdERpYWxvZ1N0YXRlIHtPUEVOLCBDTE9TSU5HLCBDTE9TRUR9XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgZGlhbG9nIG9wZW5lZCB2aWEgdGhlIE1hdERpYWxvZyBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nUmVmPFQsIFIgPSBhbnk+IHtcbiAgLyoqIFRoZSBpbnN0YW5jZSBvZiBjb21wb25lbnQgb3BlbmVkIGludG8gdGhlIGRpYWxvZy4gKi9cbiAgY29tcG9uZW50SW5zdGFuY2U6IFQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgYWxsb3dlZCB0byBjbG9zZSB0aGUgZGlhbG9nLiAqL1xuICBkaXNhYmxlQ2xvc2U6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB0aGlzLl9jb250YWluZXJJbnN0YW5jZS5fY29uZmlnLmRpc2FibGVDbG9zZTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRpYWxvZyBoYXMgZmluaXNoZWQgb3BlbmluZy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgZGlhbG9nIGhhcyBmaW5pc2hlZCBjbG9zaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlckNsb3NlZCA9IG5ldyBTdWJqZWN0PFIgfCB1bmRlZmluZWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBkaWFsb2cgaGFzIHN0YXJ0ZWQgY2xvc2luZy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYmVmb3JlQ2xvc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogUmVzdWx0IHRvIGJlIHBhc3NlZCB0byBhZnRlckNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdWx0OiBSIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBIYW5kbGUgdG8gdGhlIHRpbWVvdXQgdGhhdCdzIHJ1bm5pbmcgYXMgYSBmYWxsYmFjayBpbiBjYXNlIHRoZSBleGl0IGFuaW1hdGlvbiBkb2Vzbid0IGZpcmUuICovXG4gIHByaXZhdGUgX2Nsb3NlRmFsbGJhY2tUaW1lb3V0OiBudW1iZXI7XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5PUEVOO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgcHVibGljIF9jb250YWluZXJJbnN0YW5jZTogTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYF9sb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAgX2xvY2F0aW9uPzogTG9jYXRpb24sXG4gICAgcmVhZG9ubHkgaWQ6IHN0cmluZyA9IGBtYXQtZGlhbG9nLSR7dW5pcXVlSWQrK31gKSB7XG5cbiAgICAvLyBQYXNzIHRoZSBpZCBhbG9uZyB0byB0aGUgY29udGFpbmVyLlxuICAgIF9jb250YWluZXJJbnN0YW5jZS5faWQgPSBpZDtcblxuICAgIC8vIEVtaXQgd2hlbiBvcGVuaW5nIGFuaW1hdGlvbiBjb21wbGV0ZXNcbiAgICBfY29udGFpbmVySW5zdGFuY2UuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicpLFxuICAgICAgdGFrZSgxKVxuICAgIClcbiAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLm5leHQoKTtcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNwb3NlIG92ZXJsYXkgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuICAgIF9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnZG9uZScgJiYgZXZlbnQudG9TdGF0ZSA9PT0gJ2V4aXQnKSxcbiAgICAgIHRha2UoMSlcbiAgICApLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgfSk7XG5cbiAgICBfb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9iZWZvcmVDbG9zZWQubmV4dCh0aGlzLl9yZXN1bHQpO1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLmNvbXBsZXRlKCk7XG4gICAgICB0aGlzLl9hZnRlckNsb3NlZC5uZXh0KHRoaXMuX3Jlc3VsdCk7XG4gICAgICB0aGlzLl9hZnRlckNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IG51bGwhO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgfSk7XG5cbiAgICBfb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKClcbiAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgIHJldHVybiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIXRoaXMuZGlzYWJsZUNsb3NlICYmICFoYXNNb2RpZmllcktleShldmVudCk7XG4gICAgICB9KSlcbiAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gZGlhbG9nUmVzdWx0IE9wdGlvbmFsIHJlc3VsdCB0byByZXR1cm4gdG8gdGhlIGRpYWxvZyBvcGVuZXIuXG4gICAqL1xuICBjbG9zZShkaWFsb2dSZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzdWx0ID0gZGlhbG9nUmVzdWx0O1xuXG4gICAgLy8gVHJhbnNpdGlvbiB0aGUgYmFja2Ryb3AgaW4gcGFyYWxsZWwgdG8gdGhlIGRpYWxvZy5cbiAgICB0aGlzLl9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnc3RhcnQnKSxcbiAgICAgIHRha2UoMSlcbiAgICApXG4gICAgLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICB0aGlzLl9iZWZvcmVDbG9zZWQubmV4dChkaWFsb2dSZXN1bHQpO1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLmNvbXBsZXRlKCk7XG4gICAgICB0aGlzLl9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLkNMT1NFRDtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoQmFja2Ryb3AoKTtcblxuICAgICAgLy8gVGhlIGxvZ2ljIHRoYXQgZGlzcG9zZXMgb2YgdGhlIG92ZXJsYXkgZGVwZW5kcyBvbiB0aGUgZXhpdCBhbmltYXRpb24gY29tcGxldGluZywgaG93ZXZlclxuICAgICAgLy8gaXQgaXNuJ3QgZ3VhcmFudGVlZCBpZiB0aGUgcGFyZW50IHZpZXcgaXMgZGVzdHJveWVkIHdoaWxlIGl0J3MgcnVubmluZy4gQWRkIGEgZmFsbGJhY2tcbiAgICAgIC8vIHRpbWVvdXQgd2hpY2ggd2lsbCBjbGVhbiBldmVyeXRoaW5nIHVwIGlmIHRoZSBhbmltYXRpb24gaGFzbid0IGZpcmVkIHdpdGhpbiB0aGUgc3BlY2lmaWVkXG4gICAgICAvLyBhbW91bnQgb2YgdGltZSBwbHVzIDEwMG1zLiBXZSBkb24ndCBuZWVkIHRvIHJ1biB0aGlzIG91dHNpZGUgdGhlIE5nWm9uZSwgYmVjYXVzZSBmb3IgdGhlXG4gICAgICAvLyB2YXN0IG1ham9yaXR5IG9mIGNhc2VzIHRoZSB0aW1lb3V0IHdpbGwgaGF2ZSBiZWVuIGNsZWFyZWQgYmVmb3JlIGl0IGhhcyB0aGUgY2hhbmNlIHRvIGZpcmUuXG4gICAgICB0aGlzLl9jbG9zZUZhbGxiYWNrVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIH0sIGV2ZW50LnRvdGFsVGltZSArIDEwMCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb250YWluZXJJbnN0YW5jZS5fc3RhcnRFeGl0QW5pbWF0aW9uKCk7XG4gICAgdGhpcy5fc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5DTE9TSU5HO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBvcGVuaW5nLlxuICAgKi9cbiAgYWZ0ZXJPcGVuZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FmdGVyT3BlbmVkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBjbG9zaW5nLlxuICAgKi9cbiAgYWZ0ZXJDbG9zZWQoKTogT2JzZXJ2YWJsZTxSIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FmdGVyQ2xvc2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBoYXMgc3RhcnRlZCBjbG9zaW5nLlxuICAgKi9cbiAgYmVmb3JlQ2xvc2VkKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLl9iZWZvcmVDbG9zZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgb3ZlcmxheSdzIGJhY2tkcm9wIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAqL1xuICBiYWNrZHJvcENsaWNrKCk6IE9ic2VydmFibGU8TW91c2VFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGtleWRvd24gZXZlbnRzIGFyZSB0YXJnZXRlZCBvbiB0aGUgb3ZlcmxheS5cbiAgICovXG4gIGtleWRvd25FdmVudHMoKTogT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zaXRpb24gTmV3IGRpYWxvZyBwb3NpdGlvbi5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uPzogRGlhbG9nUG9zaXRpb24pOiB0aGlzIHtcbiAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLl9nZXRQb3NpdGlvblN0cmF0ZWd5KCk7XG5cbiAgICBpZiAocG9zaXRpb24gJiYgKHBvc2l0aW9uLmxlZnQgfHwgcG9zaXRpb24ucmlnaHQpKSB7XG4gICAgICBwb3NpdGlvbi5sZWZ0ID8gc3RyYXRlZ3kubGVmdChwb3NpdGlvbi5sZWZ0KSA6IHN0cmF0ZWd5LnJpZ2h0KHBvc2l0aW9uLnJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyYXRlZ3kuY2VudGVySG9yaXpvbnRhbGx5KCk7XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uICYmIChwb3NpdGlvbi50b3AgfHwgcG9zaXRpb24uYm90dG9tKSkge1xuICAgICAgcG9zaXRpb24udG9wID8gc3RyYXRlZ3kudG9wKHBvc2l0aW9uLnRvcCkgOiBzdHJhdGVneS5ib3R0b20ocG9zaXRpb24uYm90dG9tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyYXRlZ3kuY2VudGVyVmVydGljYWxseSgpO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHdpZHRoIGFuZCBoZWlnaHQuXG4gICAqIEBwYXJhbSB3aWR0aCBOZXcgd2lkdGggb2YgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGhlaWdodCBOZXcgaGVpZ2h0IG9mIHRoZSBkaWFsb2cuXG4gICAqL1xuICB1cGRhdGVTaXplKHdpZHRoOiBzdHJpbmcgPSAnJywgaGVpZ2h0OiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMuX2dldFBvc2l0aW9uU3RyYXRlZ3koKS53aWR0aCh3aWR0aCkuaGVpZ2h0KGhlaWdodCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEFkZCBhIENTUyBjbGFzcyBvciBhbiBhcnJheSBvZiBjbGFzc2VzIHRvIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIGFkZFBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10pOiB0aGlzIHtcbiAgICB0aGlzLl9vdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmVtb3ZlIGEgQ1NTIGNsYXNzIG9yIGFuIGFycmF5IG9mIGNsYXNzZXMgZnJvbSB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICByZW1vdmVQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5yZW1vdmVQYW5lbENsYXNzKGNsYXNzZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBvcGVuaW5nLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGFmdGVyT3BlbmVkYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBhZnRlck9wZW4oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuYWZ0ZXJPcGVuZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBkaWFsb2cgaGFzIHN0YXJ0ZWQgY2xvc2luZy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBiZWZvcmVDbG9zZWRgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGJlZm9yZUNsb3NlKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmJlZm9yZUNsb3NlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRpYWxvZydzIGxpZmVjeWNsZS4gKi9cbiAgZ2V0U3RhdGUoKTogTWF0RGlhbG9nU3RhdGUge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIC8qKiBGZXRjaGVzIHRoZSBwb3NpdGlvbiBzdHJhdGVneSBvYmplY3QgZnJvbSB0aGUgb3ZlcmxheSByZWYuICovXG4gIHByaXZhdGUgX2dldFBvc2l0aW9uU3RyYXRlZ3koKTogR2xvYmFsUG9zaXRpb25TdHJhdGVneSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneSBhcyBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5O1xuICB9XG59XG4iXX0=