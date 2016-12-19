import { MdDialogRef } from './dialog-ref';
/** Custom injector type specifically for instantiating components with a dialog. */
export var DialogInjector = (function () {
    function DialogInjector(_dialogRef, _parentInjector) {
        this._dialogRef = _dialogRef;
        this._parentInjector = _parentInjector;
    }
    DialogInjector.prototype.get = function (token, notFoundValue) {
        if (token === MdDialogRef) {
            return this._dialogRef;
        }
        return this._parentInjector.get(token, notFoundValue);
    };
    return DialogInjector;
}());

//# sourceMappingURL=dialog-injector.js.map
