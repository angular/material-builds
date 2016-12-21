import { ComponentRef, NgZone, OnDestroy } from '@angular/core';
import { BasePortalHost, ComponentPortal, PortalHostDirective, TemplatePortal } from '../core';
import { MdDialogConfig } from './dialog-config';
import { MdDialogRef } from './dialog-ref';
import { FocusTrap } from '../core/a11y/focus-trap';
import 'rxjs/add/operator/first';
/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
export declare class MdDialogContainer extends BasePortalHost implements OnDestroy {
    private _ngZone;
    /** The portal host inside of this container into which the dialog content will be loaded. */
    _portalHost: PortalHostDirective;
    /** The directive that traps and manages focus within the dialog. */
    _focusTrap: FocusTrap;
    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
    private _elementFocusedBeforeDialogWasOpened;
    /** The dialog configuration. */
    dialogConfig: MdDialogConfig;
    /** Reference to the open dialog. */
    dialogRef: MdDialogRef<any>;
    constructor(_ngZone: NgZone);
    /**
     * Attach a portal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** @docs-private */
    attachTemplatePortal(portal: TemplatePortal): Map<string, any>;
    /**
     * Handles the user pressing the Escape key.
     * @docs-private
     */
    handleEscapeKey(): void;
    ngOnDestroy(): void;
}
