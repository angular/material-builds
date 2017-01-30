var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core';
/**
 * Exception thrown when a ComponentPortal is attached to a DomPortalHost without an origin.
 * @docs-private
 */
export var MdDialogContentAlreadyAttachedError = (function (_super) {
    __extends(MdDialogContentAlreadyAttachedError, _super);
    function MdDialogContentAlreadyAttachedError() {
        _super.call(this, 'Attempting to attach dialog content after content is already attached');
    }
    return MdDialogContentAlreadyAttachedError;
}(MdError));
//# sourceMappingURL=dialog-errors.js.map