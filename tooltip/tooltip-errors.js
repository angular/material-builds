var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core';
/**
 * Exception thrown when a tooltip has an invalid position.
 * @docs-private
 */
var MdTooltipInvalidPositionError = (function (_super) {
    __extends(MdTooltipInvalidPositionError, _super);
    function MdTooltipInvalidPositionError(position) {
        return _super.call(this, "Tooltip position \"" + position + "\" is invalid.") || this;
    }
    return MdTooltipInvalidPositionError;
}(MdError));
export { MdTooltipInvalidPositionError };
//# sourceMappingURL=tooltip-errors.js.map