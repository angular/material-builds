import { Injector } from '@angular/core';
import { Overlay, ComponentType } from '../core';
import { MdDialogConfig } from './dialog-config';
import { MdDialogRef } from './dialog-ref';
/**
 * Service to open Material Design modal dialogs.
 */
export declare class MdDialog {
    private _overlay;
    private _injector;
    /** Keeps track of the currently-open dialogs. */
    private _openDialogs;
    constructor(_overlay: Overlay, _injector: Injector);
    /**
     * Opens a modal dialog containing the given component.
     * @param component Type of the component to load into the load.
     * @param config
     */
    open<T>(component: ComponentType<T>, config?: MdDialogConfig): MdDialogRef<T>;
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void;
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param dialogConfig The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    private _createOverlay(dialogConfig);
    /**
     * Attaches an MdDialogContainer to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    private _attachDialogContainer(overlay, config);
    /**
     * Attaches the user-provided component to the already-created MdDialogContainer.
     * @param component The type of component being loaded into the dialog.
     * @param dialogContainer Reference to the wrapping MdDialogContainer.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @returns A promise resolving to the MdDialogRef that should be returned to the user.
     */
    private _attachDialogContent<T>(component, dialogContainer, overlayRef);
    /**
     * Creates an overlay state from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    private _getOverlayState(dialogConfig);
    /**
     * Removes a dialog from the array of open dialogs.
     */
    private _removeOpenDialog(dialogRef);
}
