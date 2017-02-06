import { OpaqueToken } from '@angular/core';
import { MdDialogRef } from './dialog-ref';
export var MD_DIALOG_DATA = new OpaqueToken('MdDialogData');
/** Custom injector type specifically for instantiating components with a dialog. */
export var DialogInjector = (function () {
    function DialogInjector(_parentInjector, _dialogRef, _data) {
        this._parentInjector = _parentInjector;
        this._dialogRef = _dialogRef;
        this._data = _data;
    }
    DialogInjector.prototype.get = function (token, notFoundValue) {
        if (token === MdDialogRef) {
            return this._dialogRef;
        }
        if (token === MD_DIALOG_DATA && this._data) {
            return this._data;
        }
        return this._parentInjector.get(token, notFoundValue);
    };
    return DialogInjector;
}());
//# sourceMappingURL=dialog-injector.js.map