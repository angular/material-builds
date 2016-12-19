import { MdError } from '../core/errors/error';
export declare class MdInputContainerPlaceholderConflictError extends MdError {
    constructor();
}
export declare class MdInputContainerUnsupportedTypeError extends MdError {
    constructor(type: string);
}
export declare class MdInputContainerDuplicatedHintError extends MdError {
    constructor(align: string);
}
export declare class MdInputContainerMissingMdInputError extends MdError {
    constructor();
}
