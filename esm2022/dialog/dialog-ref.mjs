/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { merge, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
export var MatDialogState;
(function (MatDialogState) {
    MatDialogState[MatDialogState["OPEN"] = 0] = "OPEN";
    MatDialogState[MatDialogState["CLOSING"] = 1] = "CLOSING";
    MatDialogState[MatDialogState["CLOSED"] = 2] = "CLOSED";
})(MatDialogState || (MatDialogState = {}));
/**
 * Reference to a dialog opened via the MatDialog service.
 */
export class MatDialogRef {
    constructor(_ref, config, _containerInstance) {
        this._ref = _ref;
        this._containerInstance = _containerInstance;
        /** Subject for notifying the user that the dialog has finished opening. */
        this._afterOpened = new Subject();
        /** Subject for notifying the user that the dialog has started closing. */
        this._beforeClosed = new Subject();
        /** Current state of the dialog. */
        this._state = MatDialogState.OPEN;
        this.disableClose = config.disableClose;
        this.id = _ref.id;
        // Emit when opening animation completes
        _containerInstance._animationStateChanged
            .pipe(filter(event => event.state === 'opened'), take(1))
            .subscribe(() => {
            this._afterOpened.next();
            this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        _containerInstance._animationStateChanged
            .pipe(filter(event => event.state === 'closed'), take(1))
            .subscribe(() => {
            clearTimeout(this._closeFallbackTimeout);
            this._finishDialogClose();
        });
        _ref.overlayRef.detachments().subscribe(() => {
            this._beforeClosed.next(this._result);
            this._beforeClosed.complete();
            this._finishDialogClose();
        });
        merge(this.backdropClick(), this.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)))).subscribe(event => {
            if (!this.disableClose) {
                event.preventDefault();
                _closeDialogVia(this, event.type === 'keydown' ? 'keyboard' : 'mouse');
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
        this._containerInstance._animationStateChanged
            .pipe(filter(event => event.state === 'closing'), take(1))
            .subscribe(event => {
            this._beforeClosed.next(dialogResult);
            this._beforeClosed.complete();
            this._ref.overlayRef.detachBackdrop();
            // The logic that disposes of the overlay depends on the exit animation completing, however
            // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
            // timeout which will clean everything up if the animation hasn't fired within the specified
            // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
            // vast majority of cases the timeout will have been cleared before it has the chance to fire.
            this._closeFallbackTimeout = setTimeout(() => this._finishDialogClose(), event.totalTime + 100);
        });
        this._state = MatDialogState.CLOSING;
        this._containerInstance._startExitAnimation();
    }
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     */
    afterOpened() {
        return this._afterOpened;
    }
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    afterClosed() {
        return this._ref.closed;
    }
    /**
     * Gets an observable that is notified when the dialog has started closing.
     */
    beforeClosed() {
        return this._beforeClosed;
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick() {
        return this._ref.backdropClick;
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents() {
        return this._ref.keydownEvents;
    }
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position) {
        let strategy = this._ref.config.positionStrategy;
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
        this._ref.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width = '', height = '') {
        this._ref.updateSize(width, height);
        return this;
    }
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes) {
        this._ref.addPanelClass(classes);
        return this;
    }
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes) {
        this._ref.removePanelClass(classes);
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
        this._state = MatDialogState.CLOSED;
        this._ref.close(this._result, { focusOrigin: this._closeInteractionType });
        this.componentInstance = null;
    }
}
/**
 * Closes the dialog with the specified interaction type. This is currently not part of
 * `MatDialogRef` as that would conflict with custom dialog ref mocks provided in tests.
 * More details. See: https://github.com/angular/components/pull/9257#issuecomment-651342226.
 */
// TODO: Move this back into `MatDialogRef` when we provide an official mock dialog ref.
export function _closeDialogVia(ref, interactionType, result) {
    ref._closeInteractionType = interactionType;
    return ref.close(result);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUloRCxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFJN0QsTUFBTSxDQUFOLElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN4QixtREFBSSxDQUFBO0lBQ0oseURBQU8sQ0FBQTtJQUNQLHVEQUFNLENBQUE7QUFDUixDQUFDLEVBSlcsY0FBYyxLQUFkLGNBQWMsUUFJekI7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBc0N2QixZQUNVLElBQXFCLEVBQzdCLE1BQXVCLEVBQ2hCLGtCQUFzQztRQUZyQyxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUV0Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBekIvQywyRUFBMkU7UUFDMUQsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXBELDBFQUEwRTtRQUN6RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO1FBUTlELG1DQUFtQztRQUMzQixXQUFNLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQztRQWNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDeEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBRWxCLHdDQUF3QztRQUN4QyxrQkFBa0IsQ0FBQyxzQkFBc0I7YUFDdEMsSUFBSSxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtB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R0FBb0IsRUFBRSxlQUE0QixFQUFFLE1BQVU7SUFDOUYsR0FBdUQsQ0FBQyxxQkFBcUIsR0FBRyxlQUFlLENBQUM7SUFDakcsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIFBvc3NpYmxlIHN0YXRlcyBvZiB0aGUgbGlmZWN5Y2xlIG9mIGEgZGlhbG9nLiAqL1xuaW1wb3J0IHtGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHttZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0RpYWxvZ1JlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RpYWxvZyc7XG5pbXBvcnQge0RpYWxvZ1Bvc2l0aW9uLCBNYXREaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbnRhaW5lcn0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0VTQ0FQRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge0dsb2JhbFBvc2l0aW9uU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGVudW0gTWF0RGlhbG9nU3RhdGUge1xuICBPUEVOLFxuICBDTE9TSU5HLFxuICBDTE9TRUQsXG59XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgZGlhbG9nIG9wZW5lZCB2aWEgdGhlIE1hdERpYWxvZyBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nUmVmPFQsIFIgPSBhbnk+IHtcbiAgLyoqIFRoZSBpbnN0YW5jZSBvZiBjb21wb25lbnQgb3BlbmVkIGludG8gdGhlIGRpYWxvZy4gKi9cbiAgY29tcG9uZW50SW5zdGFuY2U6IFQ7XG5cbiAgLyoqXG4gICAqIGBDb21wb25lbnRSZWZgIG9mIHRoZSBjb21wb25lbnQgb3BlbmVkIGludG8gdGhlIGRpYWxvZy4gV2lsbCBiZVxuICAgKiBudWxsIHdoZW4gdGhlIGRpYWxvZyBpcyBvcGVuZWQgdXNpbmcgYSBgVGVtcGxhdGVSZWZgLlxuICAgKi9cbiAgcmVhZG9ubHkgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8VD4gfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gY2xvc2UgdGhlIGRpYWxvZy4gKi9cbiAgZGlzYWJsZUNsb3NlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBkaWFsb2cuICovXG4gIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBkaWFsb2cgaGFzIGZpbmlzaGVkIG9wZW5pbmcuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRpYWxvZyBoYXMgc3RhcnRlZCBjbG9zaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9iZWZvcmVDbG9zZWQgPSBuZXcgU3ViamVjdDxSIHwgdW5kZWZpbmVkPigpO1xuXG4gIC8qKiBSZXN1bHQgdG8gYmUgcGFzc2VkIHRvIGFmdGVyQ2xvc2VkLiAqL1xuICBwcml2YXRlIF9yZXN1bHQ6IFIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEhhbmRsZSB0byB0aGUgdGltZW91dCB0aGF0J3MgcnVubmluZyBhcyBhIGZhbGxiYWNrIGluIGNhc2UgdGhlIGV4aXQgYW5pbWF0aW9uIGRvZXNuJ3QgZmlyZS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VGYWxsYmFja1RpbWVvdXQ6IG51bWJlcjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLk9QRU47XG5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIHNob3VsZG4ndCBoYXZlIHRvIGRlY2xhcmUgdGhpcyBwcm9wZXJ0eSwgYmVjYXVzZSBgRGlhbG9nUmVmLmNsb3NlYFxuICAvLyBhbHJlYWR5IGhhcyBhIHNlY29uZCBgb3B0aW9uc2AgcGFyYW1ldGVyIHRoYXQgd2UgY2FuIHVzZS4gVGhlIHByb2JsZW0gaXMgdGhhdCBpbnRlcm5hbCB0ZXN0c1xuICAvLyBoYXZlIGFzc2VydGlvbnMgbGlrZSBgZXhwZWN0KE1hdERpYWxvZ1JlZi5jbG9zZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZm9vKWAgd2hpY2ggd2lsbCBicmVhayxcbiAgLy8gYmVjYXVzZSBpdCdsbCBiZSBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzIGJ5IHRoaW5ncyBsaWtlIGBNYXREaWFsb2dDbG9zZWAuXG4gIC8qKiBJbnRlcmFjdGlvbiB0aGF0IGNhdXNlZCB0aGUgZGlhbG9nIHRvIGNsb3NlLiAqL1xuICBwcml2YXRlIF9jbG9zZUludGVyYWN0aW9uVHlwZTogRm9jdXNPcmlnaW4gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVmOiBEaWFsb2dSZWY8UiwgVD4sXG4gICAgY29uZmlnOiBNYXREaWFsb2dDb25maWcsXG4gICAgcHVibGljIF9jb250YWluZXJJbnN0YW5jZTogTWF0RGlhbG9nQ29udGFpbmVyLFxuICApIHtcbiAgICB0aGlzLmRpc2FibGVDbG9zZSA9IGNvbmZpZy5kaXNhYmxlQ2xvc2U7XG4gICAgdGhpcy5pZCA9IF9yZWYuaWQ7XG5cbiAgICAvLyBFbWl0IHdoZW4gb3BlbmluZyBhbmltYXRpb24gY29tcGxldGVzXG4gICAgX2NvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQuc3RhdGUgPT09ICdvcGVuZWQnKSxcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9hZnRlck9wZW5lZC5uZXh0KCk7XG4gICAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgIC8vIERpc3Bvc2Ugb3ZlcmxheSB3aGVuIGNsb3NpbmcgYW5pbWF0aW9uIGlzIGNvbXBsZXRlXG4gICAgX2NvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQuc3RhdGUgPT09ICdjbG9zZWQnKSxcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQpO1xuICAgICAgICB0aGlzLl9maW5pc2hEaWFsb2dDbG9zZSgpO1xuICAgICAgfSk7XG5cbiAgICBfcmVmLm92ZXJsYXlSZWYuZGV0YWNobWVudHMoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLm5leHQodGhpcy5fcmVzdWx0KTtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5fZmluaXNoRGlhbG9nQ2xvc2UoKTtcbiAgICB9KTtcblxuICAgIG1lcmdlKFxuICAgICAgdGhpcy5iYWNrZHJvcENsaWNrKCksXG4gICAgICB0aGlzLmtleWRvd25FdmVudHMoKS5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSxcbiAgICAgICksXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVDbG9zZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBfY2xvc2VEaWFsb2dWaWEodGhpcywgZXZlbnQudHlwZSA9PT0gJ2tleWRvd24nID8gJ2tleWJvYXJkJyA6ICdtb3VzZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIHRoZSBkaWFsb2cuXG4gICAqIEBwYXJhbSBkaWFsb2dSZXN1bHQgT3B0aW9uYWwgcmVzdWx0IHRvIHJldHVybiB0byB0aGUgZGlhbG9nIG9wZW5lci5cbiAgICovXG4gIGNsb3NlKGRpYWxvZ1Jlc3VsdD86IFIpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXN1bHQgPSBkaWFsb2dSZXN1bHQ7XG5cbiAgICAvLyBUcmFuc2l0aW9uIHRoZSBiYWNrZHJvcCBpbiBwYXJhbGxlbCB0byB0aGUgZGlhbG9nLlxuICAgIHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQuc3RhdGUgPT09ICdjbG9zaW5nJyksXG4gICAgICAgIHRha2UoMSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLm5leHQoZGlhbG9nUmVzdWx0KTtcbiAgICAgICAgdGhpcy5fYmVmb3JlQ2xvc2VkLmNvbXBsZXRlKCk7XG4gICAgICAgIHRoaXMuX3JlZi5vdmVybGF5UmVmLmRldGFjaEJhY2tkcm9wKCk7XG5cbiAgICAgICAgLy8gVGhlIGxvZ2ljIHRoYXQgZGlzcG9zZXMgb2YgdGhlIG92ZXJsYXkgZGVwZW5kcyBvbiB0aGUgZXhpdCBhbmltYXRpb24gY29tcGxldGluZywgaG93ZXZlclxuICAgICAgICAvLyBpdCBpc24ndCBndWFyYW50ZWVkIGlmIHRoZSBwYXJlbnQgdmlldyBpcyBkZXN0cm95ZWQgd2hpbGUgaXQncyBydW5uaW5nLiBBZGQgYSBmYWxsYmFja1xuICAgICAgICAvLyB0aW1lb3V0IHdoaWNoIHdpbGwgY2xlYW4gZXZlcnl0aGluZyB1cCBpZiB0aGUgYW5pbWF0aW9uIGhhc24ndCBmaXJlZCB3aXRoaW4gdGhlIHNwZWNpZmllZFxuICAgICAgICAvLyBhbW91bnQgb2YgdGltZSBwbHVzIDEwMG1zLiBXZSBkb24ndCBuZWVkIHRvIHJ1biB0aGlzIG91dHNpZGUgdGhlIE5nWm9uZSwgYmVjYXVzZSBmb3IgdGhlXG4gICAgICAgIC8vIHZhc3QgbWFqb3JpdHkgb2YgY2FzZXMgdGhlIHRpbWVvdXQgd2lsbCBoYXZlIGJlZW4gY2xlYXJlZCBiZWZvcmUgaXQgaGFzIHRoZSBjaGFuY2UgdG8gZmlyZS5cbiAgICAgICAgdGhpcy5fY2xvc2VGYWxsYmFja1RpbWVvdXQgPSBzZXRUaW1lb3V0KFxuICAgICAgICAgICgpID0+IHRoaXMuX2ZpbmlzaERpYWxvZ0Nsb3NlKCksXG4gICAgICAgICAgZXZlbnQudG90YWxUaW1lICsgMTAwLFxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IE1hdERpYWxvZ1N0YXRlLkNMT1NJTkc7XG4gICAgdGhpcy5fY29udGFpbmVySW5zdGFuY2UuX3N0YXJ0RXhpdEFuaW1hdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBvcGVuaW5nLlxuICAgKi9cbiAgYWZ0ZXJPcGVuZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FmdGVyT3BlbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBpcyBmaW5pc2hlZCBjbG9zaW5nLlxuICAgKi9cbiAgYWZ0ZXJDbG9zZWQoKTogT2JzZXJ2YWJsZTxSIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZi5jbG9zZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgZGlhbG9nIGhhcyBzdGFydGVkIGNsb3NpbmcuXG4gICAqL1xuICBiZWZvcmVDbG9zZWQoKTogT2JzZXJ2YWJsZTxSIHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2JlZm9yZUNsb3NlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBvdmVybGF5J3MgYmFja2Ryb3AgaGFzIGJlZW4gY2xpY2tlZC5cbiAgICovXG4gIGJhY2tkcm9wQ2xpY2soKTogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZi5iYWNrZHJvcENsaWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4ga2V5ZG93biBldmVudHMgYXJlIHRhcmdldGVkIG9uIHRoZSBvdmVybGF5LlxuICAgKi9cbiAga2V5ZG93bkV2ZW50cygpOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fcmVmLmtleWRvd25FdmVudHM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlhbG9nJ3MgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBOZXcgZGlhbG9nIHBvc2l0aW9uLlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24ocG9zaXRpb24/OiBEaWFsb2dQb3NpdGlvbik6IHRoaXMge1xuICAgIGxldCBzdHJhdGVneSA9IHRoaXMuX3JlZi5jb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5O1xuXG4gICAgaWYgKHBvc2l0aW9uICYmIChwb3NpdGlvbi5sZWZ0IHx8IHBvc2l0aW9uLnJpZ2h0KSkge1xuICAgICAgcG9zaXRpb24ubGVmdCA/IHN0cmF0ZWd5LmxlZnQocG9zaXRpb24ubGVmdCkgOiBzdHJhdGVneS5yaWdodChwb3NpdGlvbi5yaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmF0ZWd5LmNlbnRlckhvcml6b250YWxseSgpO1xuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiAmJiAocG9zaXRpb24udG9wIHx8IHBvc2l0aW9uLmJvdHRvbSkpIHtcbiAgICAgIHBvc2l0aW9uLnRvcCA/IHN0cmF0ZWd5LnRvcChwb3NpdGlvbi50b3ApIDogc3RyYXRlZ3kuYm90dG9tKHBvc2l0aW9uLmJvdHRvbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmF0ZWd5LmNlbnRlclZlcnRpY2FsbHkoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZWYudXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHdpZHRoIGFuZCBoZWlnaHQuXG4gICAqIEBwYXJhbSB3aWR0aCBOZXcgd2lkdGggb2YgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGhlaWdodCBOZXcgaGVpZ2h0IG9mIHRoZSBkaWFsb2cuXG4gICAqL1xuICB1cGRhdGVTaXplKHdpZHRoOiBzdHJpbmcgPSAnJywgaGVpZ2h0OiBzdHJpbmcgPSAnJyk6IHRoaXMge1xuICAgIHRoaXMuX3JlZi51cGRhdGVTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEFkZCBhIENTUyBjbGFzcyBvciBhbiBhcnJheSBvZiBjbGFzc2VzIHRvIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIGFkZFBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10pOiB0aGlzIHtcbiAgICB0aGlzLl9yZWYuYWRkUGFuZWxDbGFzcyhjbGFzc2VzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBSZW1vdmUgYSBDU1MgY2xhc3Mgb3IgYW4gYXJyYXkgb2YgY2xhc3NlcyBmcm9tIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIHJlbW92ZVBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10pOiB0aGlzIHtcbiAgICB0aGlzLl9yZWYucmVtb3ZlUGFuZWxDbGFzcyhjbGFzc2VzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBkaWFsb2cncyBsaWZlY3ljbGUuICovXG4gIGdldFN0YXRlKCk6IE1hdERpYWxvZ1N0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogRmluaXNoZXMgdGhlIGRpYWxvZyBjbG9zZSBieSB1cGRhdGluZyB0aGUgc3RhdGUgb2YgdGhlIGRpYWxvZ1xuICAgKiBhbmQgZGlzcG9zaW5nIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfZmluaXNoRGlhbG9nQ2xvc2UoKSB7XG4gICAgdGhpcy5fc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5DTE9TRUQ7XG4gICAgdGhpcy5fcmVmLmNsb3NlKHRoaXMuX3Jlc3VsdCwge2ZvY3VzT3JpZ2luOiB0aGlzLl9jbG9zZUludGVyYWN0aW9uVHlwZX0pO1xuICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2UgPSBudWxsITtcbiAgfVxufVxuXG4vKipcbiAqIENsb3NlcyB0aGUgZGlhbG9nIHdpdGggdGhlIHNwZWNpZmllZCBpbnRlcmFjdGlvbiB0eXBlLiBUaGlzIGlzIGN1cnJlbnRseSBub3QgcGFydCBvZlxuICogYE1hdERpYWxvZ1JlZmAgYXMgdGhhdCB3b3VsZCBjb25mbGljdCB3aXRoIGN1c3RvbSBkaWFsb2cgcmVmIG1vY2tzIHByb3ZpZGVkIGluIHRlc3RzLlxuICogTW9yZSBkZXRhaWxzLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC85MjU3I2lzc3VlY29tbWVudC02NTEzNDIyMjYuXG4gKi9cbi8vIFRPRE86IE1vdmUgdGhpcyBiYWNrIGludG8gYE1hdERpYWxvZ1JlZmAgd2hlbiB3ZSBwcm92aWRlIGFuIG9mZmljaWFsIG1vY2sgZGlhbG9nIHJlZi5cbmV4cG9ydCBmdW5jdGlvbiBfY2xvc2VEaWFsb2dWaWE8Uj4ocmVmOiBNYXREaWFsb2dSZWY8Uj4sIGludGVyYWN0aW9uVHlwZTogRm9jdXNPcmlnaW4sIHJlc3VsdD86IFIpIHtcbiAgKHJlZiBhcyB1bmtub3duIGFzIHtfY2xvc2VJbnRlcmFjdGlvblR5cGU6IEZvY3VzT3JpZ2lufSkuX2Nsb3NlSW50ZXJhY3Rpb25UeXBlID0gaW50ZXJhY3Rpb25UeXBlO1xuICByZXR1cm4gcmVmLmNsb3NlKHJlc3VsdCk7XG59XG4iXX0=