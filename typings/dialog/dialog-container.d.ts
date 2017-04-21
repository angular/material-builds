import { ComponentRef, Renderer, ElementRef, EventEmitter } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { BasePortalHost, ComponentPortal, PortalHostDirective, TemplatePortal } from '../core';
import { MdDialogConfig } from './dialog-config';
import { FocusTrapFactory } from '../core/a11y/focus-trap';
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export declare class MdDialogContainer extends BasePortalHost {
    private _renderer;
    private _elementRef;
    private _focusTrapFactory;
    /** The portal host inside of this container into which the dialog content will be loaded. */
    _portalHost: PortalHostDirective;
    /** The class that traps and manages focus within the dialog. */
    private _focusTrap;
    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
    private _elementFocusedBeforeDialogWasOpened;
    /** Reference to the global document object. */
    private _document;
    /** The dialog configuration. */
    dialogConfig: MdDialogConfig;
    /** State of the dialog animation. */
    _state: 'void' | 'enter' | 'exit';
    /** Emits the current animation state whenever it changes. */
    _onAnimationStateChange: EventEmitter<AnimationEvent>;
    constructor(_renderer: Renderer, _elementRef: ElementRef, _focusTrapFactory: FocusTrapFactory, _document: any);
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
     */
    private _trapFocus();
    /**
     * Saves a reference to the element that was focused before the dialog was opened.
     */
    private _savePreviouslyFocusedElement();
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @docs-private
     */
    _onAnimationDone(event: AnimationEvent): void;
    /**
     * Kicks off the leave animation and restores focus to the previously-focused element.
     * @docs-private
     */
    _exit(): void;
}
