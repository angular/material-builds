import { OverlayRef } from '../core';
import { Observable } from 'rxjs/Observable';
import { MdDialogContainer } from './dialog-container';
/**
 * Reference to a dialog opened via the MdDialog service.
 */
export declare class MdDialogRef<T> {
    private _overlayRef;
    _containerInstance: MdDialogContainer;
    /** The instance of component opened into the dialog. */
    componentInstance: T;
    /** Subject for notifying the user that the dialog has finished closing. */
    private _afterClosed;
    /** Result to be passed to afterClosed. */
    private _result;
    constructor(_overlayRef: OverlayRef, _containerInstance: MdDialogContainer);
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    close(dialogResult?: any): void;
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    afterClosed(): Observable<any>;
}
