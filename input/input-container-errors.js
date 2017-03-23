var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core/errors/error';
/** @docs-private */
var MdInputContainerPlaceholderConflictError = (function (_super) {
    __extends(MdInputContainerPlaceholderConflictError, _super);
    function MdInputContainerPlaceholderConflictError() {
        return _super.call(this, 'Placeholder attribute and child element were both specified.') || this;
    }
    return MdInputContainerPlaceholderConflictError;
}(MdError));
export { MdInputContainerPlaceholderConflictError };
/** @docs-private */
var MdInputContainerUnsupportedTypeError = (function (_super) {
    __extends(MdInputContainerUnsupportedTypeError, _super);
    function MdInputContainerUnsupportedTypeError(type) {
        return _super.call(this, "Input type \"" + type + "\" isn't supported by md-input-container.") || this;
    }
    return MdInputContainerUnsupportedTypeError;
}(MdError));
export { MdInputContainerUnsupportedTypeError };
/** @docs-private */
var MdInputContainerDuplicatedHintError = (function (_super) {
    __extends(MdInputContainerDuplicatedHintError, _super);
    function MdInputContainerDuplicatedHintError(align) {
        return _super.call(this, "A hint was already declared for 'align=\"" + align + "\"'.") || this;
    }
    return MdInputContainerDuplicatedHintError;
}(MdError));
export { MdInputContainerDuplicatedHintError };
/** @docs-private */
var MdInputContainerMissingMdInputError = (function (_super) {
    __extends(MdInputContainerMissingMdInputError, _super);
    function MdInputContainerMissingMdInputError() {
        return _super.call(this, 'md-input-container must contain an mdInput directive. Did you forget to add mdInput ' +
            'to the native input or textarea element?') || this;
    }
    return MdInputContainerMissingMdInputError;
}(MdError));
export { MdInputContainerMissingMdInputError };
//# sourceMappingURL=input-container-errors.js.map