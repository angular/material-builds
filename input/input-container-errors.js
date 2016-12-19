var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core/errors/error';
export var MdInputContainerPlaceholderConflictError = (function (_super) {
    __extends(MdInputContainerPlaceholderConflictError, _super);
    function MdInputContainerPlaceholderConflictError() {
        _super.call(this, 'Placeholder attribute and child element were both specified.');
    }
    return MdInputContainerPlaceholderConflictError;
}(MdError));
export var MdInputContainerUnsupportedTypeError = (function (_super) {
    __extends(MdInputContainerUnsupportedTypeError, _super);
    function MdInputContainerUnsupportedTypeError(type) {
        _super.call(this, "Input type \"" + type + "\" isn't supported by md-input-container.");
    }
    return MdInputContainerUnsupportedTypeError;
}(MdError));
export var MdInputContainerDuplicatedHintError = (function (_super) {
    __extends(MdInputContainerDuplicatedHintError, _super);
    function MdInputContainerDuplicatedHintError(align) {
        _super.call(this, "A hint was already declared for 'align=\"" + align + "\"'.");
    }
    return MdInputContainerDuplicatedHintError;
}(MdError));
export var MdInputContainerMissingMdInputError = (function (_super) {
    __extends(MdInputContainerMissingMdInputError, _super);
    function MdInputContainerMissingMdInputError() {
        _super.call(this, 'md-input-container must contain an md-input directive. Did you forget to add md-input ' +
            'to the native input or textarea element?');
    }
    return MdInputContainerMissingMdInputError;
}(MdError));

//# sourceMappingURL=input-container-errors.js.map
