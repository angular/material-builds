import { MdError } from '../core';
/**
 * Exception thrown when attempting to load an icon with a name that cannot be found.
 * @docs-private
 */
export declare class MdIconNameNotFoundError extends MdError {
    constructor(iconName: string);
}
/**
 * Exception thrown when attempting to load SVG content that does not contain the expected
 * <svg> tag.
 * @docs-private
 */
export declare class MdIconSvgTagNotFoundError extends MdError {
    constructor();
}
/**
 * Exception thrown when the consumer attempts to use `<md-icon>` without including @angular/http.
 * @docs-private
 */
export declare class MdIconNoHttpProviderError extends MdError {
    constructor();
}
/**
 * Exception thrown when an invalid icon name is passed to an md-icon component.
 * @docs-private
 */
export declare class MdIconInvalidNameError extends MdError {
    constructor(iconName: string);
}
