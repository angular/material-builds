import { ComponentRef, NgZone, OnDestroy, Renderer } from '@angular/core';
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
    private _renderer;
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
    constructor(_ngZone: NgZone, _renderer: Renderer);
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal(portal: TemplatePortal): Map<string, any>;
    /**
     * Moves the focus inside the focus trap.
     * @private
     */
    private _trapFocus();
    ngOnDestroy(): void;
}
