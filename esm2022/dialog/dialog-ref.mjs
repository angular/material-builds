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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUloRCxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFJN0QsTUFBTSxDQUFOLElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN4QixtREFBSSxDQUFBO0lBQ0oseURBQU8sQ0FBQTtJQUNQLHVEQUFNLENBQUE7QUFDUixDQUFDLEVBSlcsY0FBYyxLQUFkLGNBQWMsUUFJekI7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBc0N2QixZQUNVLElBQXFCLEVBQzdCLE1BQXVCLEVBQ2hCLGtCQUFzQztRQUZyQyxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUV0Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBekIvQywyRUFBMkU7UUFDMUQsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXBELDBFQUEwRTtRQUN6RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO1FBUTlELG1DQUFtQztRQUMzQixXQUFNLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQztRQWNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDeEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBRWxCLHdDQUF3QztRQUN4QyxrQkFBa0IsQ0FBQyxzQkFBc0I7YUFDdEMsSUFBSSxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtB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LEdBQUcsZUFBZSxDQUFDO0lBQ2pHLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBQb3NzaWJsZSBzdGF0ZXMgb2YgdGhlIGxpZmVjeWNsZSBvZiBhIGRpYWxvZy4gKi9cbmltcG9ydCB7Rm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtEaWFsb2dSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kaWFsb2cnO1xuaW1wb3J0IHtEaWFsb2dQb3NpdGlvbiwgTWF0RGlhbG9nQ29uZmlnfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuaW1wb3J0IHtNYXREaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtHbG9iYWxQb3NpdGlvblN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBlbnVtIE1hdERpYWxvZ1N0YXRlIHtcbiAgT1BFTixcbiAgQ0xPU0lORyxcbiAgQ0xPU0VELFxufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIGRpYWxvZyBvcGVuZWQgdmlhIHRoZSBNYXREaWFsb2cgc2VydmljZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ1JlZjxULCBSID0gYW55PiB7XG4gIC8qKiBUaGUgaW5zdGFuY2Ugb2YgY29tcG9uZW50IG9wZW5lZCBpbnRvIHRoZSBkaWFsb2cuICovXG4gIGNvbXBvbmVudEluc3RhbmNlOiBUO1xuXG4gIC8qKlxuICAgKiBgQ29tcG9uZW50UmVmYCBvZiB0aGUgY29tcG9uZW50IG9wZW5lZCBpbnRvIHRoZSBkaWFsb2cuIFdpbGwgYmVcbiAgICogbnVsbCB3aGVuIHRoZSBkaWFsb2cgaXMgb3BlbmVkIHVzaW5nIGEgYFRlbXBsYXRlUmVmYC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPFQ+IHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBhbGxvd2VkIHRvIGNsb3NlIHRoZSBkaWFsb2cuICovXG4gIGRpc2FibGVDbG9zZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKiogVW5pcXVlIElEIGZvciB0aGUgZGlhbG9nLiAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUgZGlhbG9nIGhhcyBmaW5pc2hlZCBvcGVuaW5nLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBkaWFsb2cgaGFzIHN0YXJ0ZWQgY2xvc2luZy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYmVmb3JlQ2xvc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogUmVzdWx0IHRvIGJlIHBhc3NlZCB0byBhZnRlckNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdWx0OiBSIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBIYW5kbGUgdG8gdGhlIHRpbWVvdXQgdGhhdCdzIHJ1bm5pbmcgYXMgYSBmYWxsYmFjayBpbiBjYXNlIHRoZSBleGl0IGFuaW1hdGlvbiBkb2Vzbid0IGZpcmUuICovXG4gIHByaXZhdGUgX2Nsb3NlRmFsbGJhY2tUaW1lb3V0OiBudW1iZXI7XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5PUEVOO1xuXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBzaG91bGRuJ3QgaGF2ZSB0byBkZWNsYXJlIHRoaXMgcHJvcGVydHksIGJlY2F1c2UgYERpYWxvZ1JlZi5jbG9zZWBcbiAgLy8gYWxyZWFkeSBoYXMgYSBzZWNvbmQgYG9wdGlvbnNgIHBhcmFtZXRlciB0aGF0IHdlIGNhbiB1c2UuIFRoZSBwcm9ibGVtIGlzIHRoYXQgaW50ZXJuYWwgdGVzdHNcbiAgLy8gaGF2ZSBhc3NlcnRpb25zIGxpa2UgYGV4cGVjdChNYXREaWFsb2dSZWYuY2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZvbylgIHdoaWNoIHdpbGwgYnJlYWssXG4gIC8vIGJlY2F1c2UgaXQnbGwgYmUgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50cyBieSB0aGluZ3MgbGlrZSBgTWF0RGlhbG9nQ2xvc2VgLlxuICAvKiogSW50ZXJhY3Rpb24gdGhhdCBjYXVzZWQgdGhlIGRpYWxvZyB0byBjbG9zZS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VJbnRlcmFjdGlvblR5cGU6IEZvY3VzT3JpZ2luIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3JlZjogRGlhbG9nUmVmPFIsIFQ+LFxuICAgIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnLFxuICAgIHB1YmxpYyBfY29udGFpbmVySW5zdGFuY2U6IE1hdERpYWxvZ0NvbnRhaW5lcixcbiAgKSB7XG4gICAgdGhpcy5kaXNhYmxlQ2xvc2UgPSBjb25maWcuZGlzYWJsZUNsb3NlO1xuICAgIHRoaXMuaWQgPSBfcmVmLmlkO1xuXG4gICAgLy8gRW1pdCB3aGVuIG9wZW5pbmcgYW5pbWF0aW9uIGNvbXBsZXRlc1xuICAgIF9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnN0YXRlID09PSAnb3BlbmVkJyksXG4gICAgICAgIHRha2UoMSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fYWZ0ZXJPcGVuZWQubmV4dCgpO1xuICAgICAgICB0aGlzLl9hZnRlck9wZW5lZC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAvLyBEaXNwb3NlIG92ZXJsYXkgd2hlbiBjbG9zaW5nIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuICAgIF9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnN0YXRlID09PSAnY2xvc2VkJyksXG4gICAgICAgIHRha2UoMSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0KTtcbiAgICAgICAgdGhpcy5fZmluaXNoRGlhbG9nQ2xvc2UoKTtcbiAgICAgIH0pO1xuXG4gICAgX3JlZi5vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5uZXh0KHRoaXMuX3Jlc3VsdCk7XG4gICAgICB0aGlzLl9iZWZvcmVDbG9zZWQuY29tcGxldGUoKTtcbiAgICAgIHRoaXMuX2ZpbmlzaERpYWxvZ0Nsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBtZXJnZShcbiAgICAgIHRoaXMuYmFja2Ryb3BDbGljaygpLFxuICAgICAgdGhpcy5rZXlkb3duRXZlbnRzKCkucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhdGhpcy5kaXNhYmxlQ2xvc2UgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSksXG4gICAgICApLFxuICAgICkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlQ2xvc2UpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgX2Nsb3NlRGlhbG9nVmlhKHRoaXMsIGV2ZW50LnR5cGUgPT09ICdrZXlkb3duJyA/ICdrZXlib2FyZCcgOiAnbW91c2UnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gZGlhbG9nUmVzdWx0IE9wdGlvbmFsIHJlc3VsdCB0byByZXR1cm4gdG8gdGhlIGRpYWxvZyBvcGVuZXIuXG4gICAqL1xuICBjbG9zZShkaWFsb2dSZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzdWx0ID0gZGlhbG9nUmVzdWx0O1xuXG4gICAgLy8gVHJhbnNpdGlvbiB0aGUgYmFja2Ryb3AgaW4gcGFyYWxsZWwgdG8gdGhlIGRpYWxvZy5cbiAgICB0aGlzLl9jb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnN0YXRlID09PSAnY2xvc2luZycpLFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5uZXh0KGRpYWxvZ1Jlc3VsdCk7XG4gICAgICAgIHRoaXMuX2JlZm9yZUNsb3NlZC5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLl9yZWYub3ZlcmxheVJlZi5kZXRhY2hCYWNrZHJvcCgpO1xuXG4gICAgICAgIC8vIFRoZSBsb2dpYyB0aGF0IGRpc3Bvc2VzIG9mIHRoZSBvdmVybGF5IGRlcGVuZHMgb24gdGhlIGV4aXQgYW5pbWF0aW9uIGNvbXBsZXRpbmcsIGhvd2V2ZXJcbiAgICAgICAgLy8gaXQgaXNuJ3QgZ3VhcmFudGVlZCBpZiB0aGUgcGFyZW50IHZpZXcgaXMgZGVzdHJveWVkIHdoaWxlIGl0J3MgcnVubmluZy4gQWRkIGEgZmFsbGJhY2tcbiAgICAgICAgLy8gdGltZW91dCB3aGljaCB3aWxsIGNsZWFuIGV2ZXJ5dGhpbmcgdXAgaWYgdGhlIGFuaW1hdGlvbiBoYXNuJ3QgZmlyZWQgd2l0aGluIHRoZSBzcGVjaWZpZWRcbiAgICAgICAgLy8gYW1vdW50IG9mIHRpbWUgcGx1cyAxMDBtcy4gV2UgZG9uJ3QgbmVlZCB0byBydW4gdGhpcyBvdXRzaWRlIHRoZSBOZ1pvbmUsIGJlY2F1c2UgZm9yIHRoZVxuICAgICAgICAvLyB2YXN0IG1ham9yaXR5IG9mIGNhc2VzIHRoZSB0aW1lb3V0IHdpbGwgaGF2ZSBiZWVuIGNsZWFyZWQgYmVmb3JlIGl0IGhhcyB0aGUgY2hhbmNlIHRvIGZpcmUuXG4gICAgICAgIHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0ID0gc2V0VGltZW91dChcbiAgICAgICAgICAoKSA9PiB0aGlzLl9maW5pc2hEaWFsb2dDbG9zZSgpLFxuICAgICAgICAgIGV2ZW50LnRvdGFsVGltZSArIDEwMCxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fc3RhdGUgPSBNYXREaWFsb2dTdGF0ZS5DTE9TSU5HO1xuICAgIHRoaXMuX2NvbnRhaW5lckluc3RhbmNlLl9zdGFydEV4aXRBbmltYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBkaWFsb2cgaXMgZmluaXNoZWQgb3BlbmluZy5cbiAgICovXG4gIGFmdGVyT3BlbmVkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hZnRlck9wZW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBkaWFsb2cgaXMgZmluaXNoZWQgY2xvc2luZy5cbiAgICovXG4gIGFmdGVyQ2xvc2VkKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLl9yZWYuY2xvc2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRpYWxvZyBoYXMgc3RhcnRlZCBjbG9zaW5nLlxuICAgKi9cbiAgYmVmb3JlQ2xvc2VkKCk6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLl9iZWZvcmVDbG9zZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgb3ZlcmxheSdzIGJhY2tkcm9wIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAqL1xuICBiYWNrZHJvcENsaWNrKCk6IE9ic2VydmFibGU8TW91c2VFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9yZWYuYmFja2Ryb3BDbGljaztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGtleWRvd24gZXZlbnRzIGFyZSB0YXJnZXRlZCBvbiB0aGUgb3ZlcmxheS5cbiAgICovXG4gIGtleWRvd25FdmVudHMoKTogT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZi5rZXlkb3duRXZlbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zaXRpb24gTmV3IGRpYWxvZyBwb3NpdGlvbi5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uPzogRGlhbG9nUG9zaXRpb24pOiB0aGlzIHtcbiAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLl9yZWYuY29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgYXMgR2xvYmFsUG9zaXRpb25TdHJhdGVneTtcblxuICAgIGlmIChwb3NpdGlvbiAmJiAocG9zaXRpb24ubGVmdCB8fCBwb3NpdGlvbi5yaWdodCkpIHtcbiAgICAgIHBvc2l0aW9uLmxlZnQgPyBzdHJhdGVneS5sZWZ0KHBvc2l0aW9uLmxlZnQpIDogc3RyYXRlZ3kucmlnaHQocG9zaXRpb24ucmlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gJiYgKHBvc2l0aW9uLnRvcCB8fCBwb3NpdGlvbi5ib3R0b20pKSB7XG4gICAgICBwb3NpdGlvbi50b3AgPyBzdHJhdGVneS50b3AocG9zaXRpb24udG9wKSA6IHN0cmF0ZWd5LmJvdHRvbShwb3NpdGlvbi5ib3R0b20pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJhdGVneS5jZW50ZXJWZXJ0aWNhbGx5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBkaWFsb2cncyB3aWR0aCBhbmQgaGVpZ2h0LlxuICAgKiBAcGFyYW0gd2lkdGggTmV3IHdpZHRoIG9mIHRoZSBkaWFsb2cuXG4gICAqIEBwYXJhbSBoZWlnaHQgTmV3IGhlaWdodCBvZiB0aGUgZGlhbG9nLlxuICAgKi9cbiAgdXBkYXRlU2l6ZSh3aWR0aDogc3RyaW5nID0gJycsIGhlaWdodDogc3RyaW5nID0gJycpOiB0aGlzIHtcbiAgICB0aGlzLl9yZWYudXBkYXRlU2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBBZGQgYSBDU1MgY2xhc3Mgb3IgYW4gYXJyYXkgb2YgY2xhc3NlcyB0byB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICBhZGRQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5fcmVmLmFkZFBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmVtb3ZlIGEgQ1NTIGNsYXNzIG9yIGFuIGFycmF5IG9mIGNsYXNzZXMgZnJvbSB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICByZW1vdmVQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5fcmVmLnJlbW92ZVBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZGlhbG9nJ3MgbGlmZWN5Y2xlLiAqL1xuICBnZXRTdGF0ZSgpOiBNYXREaWFsb2dTdGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmlzaGVzIHRoZSBkaWFsb2cgY2xvc2UgYnkgdXBkYXRpbmcgdGhlIHN0YXRlIG9mIHRoZSBkaWFsb2dcbiAgICogYW5kIGRpc3Bvc2luZyB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX2ZpbmlzaERpYWxvZ0Nsb3NlKCkge1xuICAgIHRoaXMuX3N0YXRlID0gTWF0RGlhbG9nU3RhdGUuQ0xPU0VEO1xuICAgIHRoaXMuX3JlZi5jbG9zZSh0aGlzLl9yZXN1bHQsIHtmb2N1c09yaWdpbjogdGhpcy5fY2xvc2VJbnRlcmFjdGlvblR5cGV9KTtcbiAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gbnVsbCE7XG4gIH1cbn1cblxuLyoqXG4gKiBDbG9zZXMgdGhlIGRpYWxvZyB3aXRoIHRoZSBzcGVjaWZpZWQgaW50ZXJhY3Rpb24gdHlwZS4gVGhpcyBpcyBjdXJyZW50bHkgbm90IHBhcnQgb2ZcbiAqIGBNYXREaWFsb2dSZWZgIGFzIHRoYXQgd291bGQgY29uZmxpY3Qgd2l0aCBjdXN0b20gZGlhbG9nIHJlZiBtb2NrcyBwcm92aWRlZCBpbiB0ZXN0cy5cbiAqIE1vcmUgZGV0YWlscy4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTI1NyNpc3N1ZWNvbW1lbnQtNjUxMzQyMjI2LlxuICovXG4vLyBUT0RPOiBNb3ZlIHRoaXMgYmFjayBpbnRvIGBNYXREaWFsb2dSZWZgIHdoZW4gd2UgcHJvdmlkZSBhbiBvZmZpY2lhbCBtb2NrIGRpYWxvZyByZWYuXG5leHBvcnQgZnVuY3Rpb24gX2Nsb3NlRGlhbG9nVmlhPFI+KHJlZjogTWF0RGlhbG9nUmVmPFI+LCBpbnRlcmFjdGlvblR5cGU6IEZvY3VzT3JpZ2luLCByZXN1bHQ/OiBSKSB7XG4gIChyZWYgYXMgdW5rbm93biBhcyB7X2Nsb3NlSW50ZXJhY3Rpb25UeXBlOiBGb2N1c09yaWdpbn0pLl9jbG9zZUludGVyYWN0aW9uVHlwZSA9IGludGVyYWN0aW9uVHlwZTtcbiAgcmV0dXJuIHJlZi5jbG9zZShyZXN1bHQpO1xufVxuIl19