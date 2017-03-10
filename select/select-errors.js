var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core/errors/error';
/**
 * Exception thrown when attempting to change a select's `multiple` option after initialization.
 * @docs-private
 */
export var MdSelectDynamicMultipleError = (function (_super) {
    __extends(MdSelectDynamicMultipleError, _super);
    function MdSelectDynamicMultipleError() {
        _super.call(this, 'Cannot change `multiple` mode of select after initialization.');
    }
    return MdSelectDynamicMultipleError;
}(MdError));
/**
 * Exception thrown when attempting to assign a non-array value to a select in `multiple` mode.
 * Note that `undefined` and `null` are still valid values to allow for resetting the value.
 * @docs-private
 */
export var MdSelectNonArrayValueError = (function (_super) {
    __extends(MdSelectNonArrayValueError, _super);
    function MdSelectNonArrayValueError() {
        _super.call(this, 'Cannot assign truthy non-array value to select in `multiple` mode.');
    }
    return MdSelectNonArrayValueError;
}(MdError));
//# sourceMappingURL=select-errors.js.map