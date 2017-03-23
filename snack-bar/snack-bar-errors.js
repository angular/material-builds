var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core';
/**
 * Error that is thrown when attempting to attach a snack bar that is already attached.
 * @docs-private
 */
var MdSnackBarContentAlreadyAttached = (function (_super) {
    __extends(MdSnackBarContentAlreadyAttached, _super);
    function MdSnackBarContentAlreadyAttached() {
        return _super.call(this, 'Attempting to attach snack bar content after content is already attached') || this;
    }
    return MdSnackBarContentAlreadyAttached;
}(MdError));
export { MdSnackBarContentAlreadyAttached };
//# sourceMappingURL=snack-bar-errors.js.map