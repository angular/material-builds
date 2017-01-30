import { Subject } from 'rxjs/Subject';
// TODO(josephperrott): Implement onAction observable.
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
export var MdSnackBarRef = (function () {
    function MdSnackBarRef(instance, containerInstance, _overlayRef) {
        var _this = this;
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the snack bar has closed. */
        this._afterClosed = new Subject();
        /** Subject for notifying the user that the snack bar action was called. */
        this._onAction = new Subject();
        // Sets the readonly instance of the snack bar content component.
        this._instance = instance;
        this.containerInstance = containerInstance;
        // Dismiss snackbar on action.
        this.onAction().subscribe(function () { return _this.dismiss(); });
        containerInstance._onExit().subscribe(function () { return _this._finishDismiss(); });
    }
    Object.defineProperty(MdSnackBarRef.prototype, "instance", {
        /** The instance of the component making up the content of the snack bar. */
        get: function () {
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    /** Dismisses the snack bar. */
    MdSnackBarRef.prototype.dismiss = function () {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
    };
    /** Marks the snackbar action clicked. */
    MdSnackBarRef.prototype._action = function () {
        if (!this._onAction.closed) {
            this._onAction.next();
            this._onAction.complete();
        }
    };
    /** Marks the snackbar as opened */
    MdSnackBarRef.prototype._open = function () {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    };
    /** Cleans up the DOM after closing. */
    MdSnackBarRef.prototype._finishDismiss = function () {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    };
    /** Gets an observable that is notified when the snack bar is finished closing. */
    MdSnackBarRef.prototype.afterDismissed = function () {
        return this._afterClosed.asObservable();
    };
    /** Gets an observable that is notified when the snack bar has opened and appeared. */
    MdSnackBarRef.prototype.afterOpened = function () {
        return this.containerInstance._onEnter();
    };
    /** Gets an observable that is notified when the snack bar action is called. */
    MdSnackBarRef.prototype.onAction = function () {
        return this._onAction.asObservable();
    };
    return MdSnackBarRef;
}());
//# sourceMappingURL=snack-bar-ref.js.map