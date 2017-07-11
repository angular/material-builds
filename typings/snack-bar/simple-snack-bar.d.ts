import { MdSnackBarRef } from './snack-bar-ref';
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
export declare class SimpleSnackBar {
    snackBarRef: MdSnackBarRef<SimpleSnackBar>;
    /** Data that was injected into the snack bar. */
    data: {
        message: string;
        action: string;
    };
    constructor(snackBarRef: MdSnackBarRef<SimpleSnackBar>, data: any);
    /** Dismisses the snack bar. */
    dismiss(): void;
    /** If the action button should be shown. */
    readonly hasAction: boolean;
}
