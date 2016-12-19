import { Subject } from 'rxjs/Subject';
// TODO(jelbourn): resizing
// TODO(jelbourn): afterOpen and beforeClose
/**
 * Reference to a dialog opened via the MdDialog service.
 */
export var MdDialogRef = (function () {
    function MdDialogRef(_overlayRef) {
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the dialog has finished closing. */
        this._afterClosed = new Subject();
    }
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    MdDialogRef.prototype.close = function (dialogResult) {
        this._overlayRef.dispose();
        this._afterClosed.next(dialogResult);
        this._afterClosed.complete();
    };
    /** Gets an observable that is notified when the dialog is finished closing. */
    MdDialogRef.prototype.afterClosed = function () {
        return this._afterClosed.asObservable();
    };
    return MdDialogRef;
}());

//# sourceMappingURL=dialog-ref.js.map
