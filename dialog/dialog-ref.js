import { Subject } from 'rxjs/Subject';
// TODO(jelbourn): resizing
// TODO(jelbourn): afterOpen and beforeClose
/**
 * Reference to a dialog opened via the MdDialog service.
 */
export var MdDialogRef = (function () {
    function MdDialogRef(_overlayRef, _containerInstance) {
        var _this = this;
        this._overlayRef = _overlayRef;
        this._containerInstance = _containerInstance;
        /** Subject for notifying the user that the dialog has finished closing. */
        this._afterClosed = new Subject();
        _containerInstance._onAnimationStateChange.subscribe(function (state) {
            if (state === 'exit-start') {
                // Transition the backdrop in parallel with the dialog.
                _this._overlayRef.detachBackdrop();
            }
            else if (state === 'exit') {
                _this._overlayRef.dispose();
                _this._afterClosed.next(_this._result);
                _this._afterClosed.complete();
                _this.componentInstance = null;
            }
        });
    }
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    MdDialogRef.prototype.close = function (dialogResult) {
        this._result = dialogResult;
        this._containerInstance._exit();
    };
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    MdDialogRef.prototype.afterClosed = function () {
        return this._afterClosed.asObservable();
    };
    return MdDialogRef;
}());
//# sourceMappingURL=dialog-ref.js.map