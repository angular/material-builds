import { OverlayRef } from '../core';
import { MdDialogConfig } from './dialog-config';
import { Observable } from 'rxjs/Observable';
/**
 * Reference to a dialog opened via the MdDialog service.
 */
export declare class MdDialogRef<T> {
    private _overlayRef;
    config: MdDialogConfig;
    /** The instance of component opened into the dialog. */
    componentInstance: T;
    /** Subject for notifying the user that the dialog has finished closing. */
    private _afterClosed;
    constructor(_overlayRef: OverlayRef, config: MdDialogConfig);
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
