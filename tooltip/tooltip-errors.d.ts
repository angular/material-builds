import { MdError } from '../core';
/** Exception thrown when a tooltip has an invalid position. */
export declare class MdTooltipInvalidPositionError extends MdError {
    constructor(position: string);
}
