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
var uniqueId = 0;
/**
 * Reference to a dialog opened via the MatDialog service.
 */
var MatDialogRef = /** @class */ (function () {
    function MatDialogRef(_overlayRef, _containerInstance, id) {
        var _this = this;
        if (id === void 0) { id = "mat-dialog-" + uniqueId++; }
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
        _containerInstance._animationStateChanged.pipe(filter(function (event) { return event.phaseName === 'done' && event.toState === 'enter'; }), take(1))
            .subscribe(function () {
            _this._afterOpened.next();
            _this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        _containerInstance._animationStateChanged.pipe(filter(function (event) { return event.phaseName === 'done' && event.toState === 'exit'; }), take(1)).subscribe(function () {
            clearTimeout(_this._closeFallbackTimeout);
            _this._overlayRef.dispose();
        });
        _overlayRef.detachments().subscribe(function () {
            _this._beforeClosed.next(_this._result);
            _this._beforeClosed.complete();
            _this._afterClosed.next(_this._result);
            _this._afterClosed.complete();
            _this.componentInstance = null;
            _this._overlayRef.dispose();
        });
        _overlayRef.keydownEvents()
            .pipe(filter(function (event) {
            return event.keyCode === ESCAPE && !_this.disableClose && !hasModifierKey(event);
        }))
            .subscribe(function (event) {
            event.preventDefault();
            _this.close();
        });
    }
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    MatDialogRef.prototype.close = function (dialogResult) {
        var _this = this;
        this._result = dialogResult;
        // Transition the backdrop in parallel to the dialog.
        this._containerInstance._animationStateChanged.pipe(filter(function (event) { return event.phaseName === 'start'; }), take(1))
            .subscribe(function (event) {
            _this._beforeClosed.next(dialogResult);
            _this._beforeClosed.complete();
            _this._state = 2 /* CLOSED */;
            _this._overlayRef.detachBackdrop();
            // The logic that disposes of the overlay depends on the exit animation completing, however
            // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
            // timeout which will clean everything up if the animation hasn't fired within the specified
            // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
            // vast majority of cases the timeout will have been cleared before it has the chance to fire.
            _this._closeFallbackTimeout = setTimeout(function () {
                _this._overlayRef.dispose();
            }, event.totalTime + 100);
        });
        this._containerInstance._startExitAnimation();
        this._state = 1 /* CLOSING */;
    };
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     */
    MatDialogRef.prototype.afterOpened = function () {
        return this._afterOpened.asObservable();
    };
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    MatDialogRef.prototype.afterClosed = function () {
        return this._afterClosed.asObservable();
    };
    /**
     * Gets an observable that is notified when the dialog has started closing.
     */
    MatDialogRef.prototype.beforeClosed = function () {
        return this._beforeClosed.asObservable();
    };
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    MatDialogRef.prototype.backdropClick = function () {
        return this._overlayRef.backdropClick();
    };
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    MatDialogRef.prototype.keydownEvents = function () {
        return this._overlayRef.keydownEvents();
    };
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    MatDialogRef.prototype.updatePosition = function (position) {
        var strategy = this._getPositionStrategy();
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
    };
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    MatDialogRef.prototype.updateSize = function (width, height) {
        if (width === void 0) { width = ''; }
        if (height === void 0) { height = ''; }
        this._getPositionStrategy().width(width).height(height);
        this._overlayRef.updatePosition();
        return this;
    };
    /** Add a CSS class or an array of classes to the overlay pane. */
    MatDialogRef.prototype.addPanelClass = function (classes) {
        this._overlayRef.addPanelClass(classes);
        return this;
    };
    /** Remove a CSS class or an array of classes from the overlay pane. */
    MatDialogRef.prototype.removePanelClass = function (classes) {
        this._overlayRef.removePanelClass(classes);
        return this;
    };
    /** Gets the current state of the dialog's lifecycle. */
    MatDialogRef.prototype.getState = function () {
        return this._state;
    };
    /** Fetches the position strategy object from the overlay ref. */
    MatDialogRef.prototype._getPositionStrategy = function () {
        return this._overlayRef.getConfig().positionStrategy;
    };
    return MatDialogRef;
}());
export { MatDialogRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTdELE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUs1QywyQkFBMkI7QUFFM0IsaUNBQWlDO0FBQ2pDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUtqQjs7R0FFRztBQUNIO0lBeUJFLHNCQUNVLFdBQXVCLEVBQ3hCLGtCQUFzQyxFQUNwQyxFQUF1QztRQUhsRCxpQkE0Q0M7UUF6Q1UsbUJBQUEsRUFBQSxxQkFBMkIsUUFBUSxFQUFJO1FBRnhDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3hCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDcEMsT0FBRSxHQUFGLEVBQUUsQ0FBcUM7UUF4QmxELHVEQUF1RDtRQUN2RCxpQkFBWSxHQUF3QixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUVqRiwyRUFBMkU7UUFDMUQsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXBELDJFQUEyRTtRQUMxRCxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO1FBRTdELDBFQUEwRTtRQUN6RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO1FBUTlELG1DQUFtQztRQUMzQixXQUFNLGdCQUF1QjtRQU9uQyxzQ0FBc0M7UUFDdEMsa0JBQWtCLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUU1Qix3Q0FBd0M7UUFDeEMsa0JBQWtCLENB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QyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELGlFQUFpRTtJQUN6RCwyQ0FBb0IsR0FBNUI7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsZ0JBQTBDLENBQUM7SUFDakYsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQWxNRCxJQWtNQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0VTQ0FQRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0dsb2JhbFBvc2l0aW9uU3RyYXRlZ3ksIE92ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtEaWFsb2dQb3NpdGlvbn0gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuXG5cbi8vIFRPRE8oamVsYm91cm4pOiByZXNpemluZ1xuXG4vLyBDb3VudGVyIGZvciB1bmlxdWUgZGlhbG9nIGlkcy5cbmxldCB1bmlxdWVJZCA9IDA7XG5cbi8qKiBQb3NzaWJsZSBzdGF0ZXMgb2YgdGhlIGxpZmVjeWNsZSBvZiBhIGRpYWxvZy4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE1hdERpYWxvZ1N0YXRlIHtPUEVOLCBDTE9TSU5HLCBDTE9TRUR9XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgZGlhbG9nIG9wZW5lZCB2aWEgdGhlIE1hdERpYWxvZyBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nUmVmPFQsIFIgPSBhbnk+IHtcbiAgLyoqIFRoZSBpbnN0YW5jZSBvZiBjb21wb25lbnQgb3BlbmVkIGludG8gdGhlIGRpYWxvZy4gKi9cbiAgY29tcG9uZW50SW5zdGFuY2U6IFQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgYWxsb3dlZCB0byBjbG9zZSB0aGUgZGlhbG9nLiAqL1xuICBkaXNhYmxlQ2xvc2U6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB0aGlzLl9jb250YWluZXJJbnN0YW5jZS5fY29uZmlnLmRpc2FibGVDbG9zZTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRpYWxvZyBoYXMgZmluaXNoZWQgb3BlbmluZy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgZGlhbG9nIGhhcyBmaW5pc2hlZCBjbG9zaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlckNsb3NlZCA9IG5ldyBTdWJqZWN0PFIgfCB1bmRlZmluZWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBkaWFsb2cgaGFzIHN0YXJ0ZWQgY2xvc2luZy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYmVmb3JlQ2xvc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogUmVzdWx0IHRvIGJlIHBhc3NlZCB0byBhZnRlckNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdWx0OiBSIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBIYW5kbGUgdG8gdGhlIHRpbWVvdXQgdGhhdCdzIHJ1bm5pbmcgYXMgYSBmYWxsYmFjayBpbiBjYXNlIHRoZSBleGl0IGFuaW1hdGlvbiBkb2Vzbid0IGZpcmUuICovXG4gIHByaXZhdGUgX2Nsb3NlRmFsbGJhY2tUaW1lb3V0OiBudW1iZXI7XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5PUEVOO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgcHVibGljIF9jb250YWluZXJJbnN0YW5jZTogTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgIHJlYWRvbmx5IGlkOiBzdHJpbmcgPSBgbWF0LWRpYWxvZy0ke3VuaXF1ZUlkKyt9YCkge1xuXG4gICAgLy8gUGFzcyB0aGUgaWQgYWxvbmcgdG8gdGhlIGNvbnRhaW5lci5cbiAgICBfY29udGFpbmVySW5zdGFuY2UuX2lkID0gaWQ7XG5cbiAgICAvLyBFbWl0IHdoZW4gb3BlbmluZyBhbmltYXRpb24gY29tcGxldGVzXG4gICAgX2NvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQucGlwZShcbiAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC5waGFzZU5hbWUgPT09ICdkb25lJyAmJiBldmVudC50b1N0YXRlID09PSAnZW50ZXInKSxcbiAgICAgIHRha2UoMSlcbiAgICApXG4gICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5uZXh0KCk7XG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gRGlzcG9zZSBvdmVybGF5IHdoZW4gY2xvc2luZyBhbmltYXRpb24gaXMgY29tcGxldGVcbiAgICBfY29udGFpbmVySW5zdGFuY2UuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdleGl0JyksXG4gICAgICB0YWtlKDEpXG4gICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0KTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgIH0pO1xuXG4gICAgX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLm5leHQodGhpcy5fcmVzdWx0KTtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5fYWZ0ZXJDbG9zZWQubmV4dCh0aGlzLl9yZXN1bHQpO1xuICAgICAgdGhpcy5fYWZ0ZXJDbG9zZWQuY29tcGxldGUoKTtcbiAgICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2UgPSBudWxsITtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgIH0pO1xuXG4gICAgX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpXG4gICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICByZXR1cm4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuICAgICAgfSkpXG4gICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGRpYWxvZ1Jlc3VsdCBPcHRpb25hbCByZXN1bHQgdG8gcmV0dXJuIHRvIHRoZSBkaWFsb2cgb3BlbmVyLlxuICAgKi9cbiAgY2xvc2UoZGlhbG9nUmVzdWx0PzogUik6IHZvaWQge1xuICAgIHRoaXMuX3Jlc3VsdCA9IGRpYWxvZ1Jlc3VsdDtcblxuICAgIC8vIFRyYW5zaXRpb24gdGhlIGJhY2tkcm9wIGluIHBhcmFsbGVsIHRvIHRoZSBkaWFsb2cuXG4gICAgdGhpcy5fY29udGFpbmVySW5zdGFuY2UuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ3N0YXJ0JyksXG4gICAgICB0YWtlKDEpXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLm5leHQoZGlhbG9nUmVzdWx0KTtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5fc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5DTE9TRUQ7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaEJhY2tkcm9wKCk7XG5cbiAgICAgIC8vIFRoZSBsb2dpYyB0aGF0IGRpc3Bvc2VzIG9mIHRoZSBvdmVybGF5IGRlcGVuZHMgb24gdGhlIGV4aXQgYW5pbWF0aW9uIGNvbXBsZXRpbmcsIGhvd2V2ZXJcbiAgICAgIC8vIGl0IGlzbid0IGd1YXJhbnRlZWQgaWYgdGhlIHBhcmVudCB2aWV3IGlzIGRlc3Ryb3llZCB3aGlsZSBpdCdzIHJ1bm5pbmcuIEFkZCBhIGZhbGxiYWNrXG4gICAgICAvLyB0aW1lb3V0IHdoaWNoIHdpbGwgY2xlYW4gZXZlcnl0aGluZyB1cCBpZiB0aGUgYW5pbWF0aW9uIGhhc24ndCBmaXJlZCB3aXRoaW4gdGhlIHNwZWNpZmllZFxuICAgICAgLy8gYW1vdW50IG9mIHRpbWUgcGx1cyAxMDBtcy4gV2UgZG9uJ3QgbmVlZCB0byBydW4gdGhpcyBvdXRzaWRlIHRoZSBOZ1pvbmUsIGJlY2F1c2UgZm9yIHRoZVxuICAgICAgLy8gdmFzdCBtYWpvcml0eSBvZiBjYXNlcyB0aGUgdGltZW91dCB3aWxsIGhhdmUgYmVlbiBjbGVhcmVkIGJlZm9yZSBpdCBoYXMgdGhlIGNoYW5jZSB0byBmaXJlLlxuICAgICAgdGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB9LCBldmVudC50b3RhbFRpbWUgKyAxMDApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY29udGFpbmVySW5zdGFuY2UuX3N0YXJ0RXhpdEFuaW1hdGlvbigpO1xuICAgIHRoaXMuX3N0YXRlID0gTWF0RGlhbG9nU3RhdGUuQ0xPU0lORztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBkaWFsb2cgaXMgZmluaXNoZWQgb3BlbmluZy5cbiAgICovXG4gIGFmdGVyT3BlbmVkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlck9wZW5lZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBkaWFsb2cgaXMgZmluaXNoZWQgY2xvc2luZy5cbiAgICovXG4gIGFmdGVyQ2xvc2VkKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlckNsb3NlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBkaWFsb2cgaGFzIHN0YXJ0ZWQgY2xvc2luZy5cbiAgICovXG4gIGJlZm9yZUNsb3NlZCgpOiBPYnNlcnZhYmxlPFIgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYmVmb3JlQ2xvc2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIG92ZXJsYXkncyBiYWNrZHJvcCBoYXMgYmVlbiBjbGlja2VkLlxuICAgKi9cbiAgYmFja2Ryb3BDbGljaygpOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiBrZXlkb3duIGV2ZW50cyBhcmUgdGFyZ2V0ZWQgb24gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBrZXlkb3duRXZlbnRzKCk6IE9ic2VydmFibGU8S2V5Ym9hcmRFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBkaWFsb2cncyBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHBvc2l0aW9uIE5ldyBkaWFsb2cgcG9zaXRpb24uXG4gICAqL1xuICB1cGRhdGVQb3NpdGlvbihwb3NpdGlvbj86IERpYWxvZ1Bvc2l0aW9uKTogdGhpcyB7XG4gICAgbGV0IHN0cmF0ZWd5ID0gdGhpcy5fZ2V0UG9zaXRpb25TdHJhdGVneSgpO1xuXG4gICAgaWYgKHBvc2l0aW9uICYmIChwb3NpdGlvbi5sZWZ0IHx8IHBvc2l0aW9uLnJpZ2h0KSkge1xuICAgICAgcG9zaXRpb24ubGVmdCA/IHN0cmF0ZWd5LmxlZnQocG9zaXRpb24ubGVmdCkgOiBzdHJhdGVneS5yaWdodChwb3NpdGlvbi5yaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmF0ZWd5LmNlbnRlckhvcml6b250YWxseSgpO1xuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiAmJiAocG9zaXRpb24udG9wIHx8IHBvc2l0aW9uLmJvdHRvbSkpIHtcbiAgICAgIHBvc2l0aW9uLnRvcCA/IHN0cmF0ZWd5LnRvcChwb3NpdGlvbi50b3ApIDogc3RyYXRlZ3kuYm90dG9tKHBvc2l0aW9uLmJvdHRvbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmF0ZWd5LmNlbnRlclZlcnRpY2FsbHkoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBkaWFsb2cncyB3aWR0aCBhbmQgaGVpZ2h0LlxuICAgKiBAcGFyYW0gd2lkdGggTmV3IHdpZHRoIG9mIHRoZSBkaWFsb2cuXG4gICAqIEBwYXJhbSBoZWlnaHQgTmV3IGhlaWdodCBvZiB0aGUgZGlhbG9nLlxuICAgKi9cbiAgdXBkYXRlU2l6ZSh3aWR0aDogc3RyaW5nID0gJycsIGhlaWdodDogc3RyaW5nID0gJycpOiB0aGlzIHtcbiAgICB0aGlzLl9nZXRQb3NpdGlvblN0cmF0ZWd5KCkud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xuICAgIHRoaXMuX292ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBBZGQgYSBDU1MgY2xhc3Mgb3IgYW4gYXJyYXkgb2YgY2xhc3NlcyB0byB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICBhZGRQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5hZGRQYW5lbENsYXNzKGNsYXNzZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBhIENTUyBjbGFzcyBvciBhbiBhcnJheSBvZiBjbGFzc2VzIGZyb20gdGhlIG92ZXJsYXkgcGFuZS4gKi9cbiAgcmVtb3ZlUGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHRoaXMge1xuICAgIHRoaXMuX292ZXJsYXlSZWYucmVtb3ZlUGFuZWxDbGFzcyhjbGFzc2VzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBkaWFsb2cncyBsaWZlY3ljbGUuICovXG4gIGdldFN0YXRlKCk6IE1hdERpYWxvZ1N0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKiogRmV0Y2hlcyB0aGUgcG9zaXRpb24gc3RyYXRlZ3kgb2JqZWN0IGZyb20gdGhlIG92ZXJsYXkgcmVmLiAqL1xuICBwcml2YXRlIF9nZXRQb3NpdGlvblN0cmF0ZWd5KCk6IEdsb2JhbFBvc2l0aW9uU3RyYXRlZ3kge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3kgYXMgR2xvYmFsUG9zaXRpb25TdHJhdGVneTtcbiAgfVxufVxuIl19