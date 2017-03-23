var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MdError } from '../core';
/**
 * Exception thrown when cols property is missing from grid-list
 * @docs-private
 */
var MdGridListColsError = (function (_super) {
    __extends(MdGridListColsError, _super);
    function MdGridListColsError() {
        return _super.call(this, "md-grid-list: must pass in number of columns. Example: <md-grid-list cols=\"3\">") || this;
    }
    return MdGridListColsError;
}(MdError));
export { MdGridListColsError };
/**
 * Exception thrown when a tile's colspan is longer than the number of cols in list
 * @docs-private
 */
var MdGridTileTooWideError = (function (_super) {
    __extends(MdGridTileTooWideError, _super);
    function MdGridTileTooWideError(cols, listLength) {
        return _super.call(this, "md-grid-list: tile with colspan " + cols + " is wider than grid with cols=\"" + listLength + "\".") || this;
    }
    return MdGridTileTooWideError;
}(MdError));
export { MdGridTileTooWideError };
/**
 * Exception thrown when an invalid ratio is passed in as a rowHeight
 * @docs-private
 */
var MdGridListBadRatioError = (function (_super) {
    __extends(MdGridListBadRatioError, _super);
    function MdGridListBadRatioError(value) {
        return _super.call(this, "md-grid-list: invalid ratio given for row-height: \"" + value + "\"") || this;
    }
    return MdGridListBadRatioError;
}(MdError));
export { MdGridListBadRatioError };
//# sourceMappingURL=grid-list-errors.js.map