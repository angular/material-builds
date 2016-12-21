import { ComponentRef, AnimationTransitionEvent, NgZone, OnDestroy } from '@angular/core';
import { BasePortalHost, ComponentPortal, TemplatePortal, PortalHostDirective } from '../core';
import { MdSnackBarConfig } from './snack-bar-config';
import { Observable } from 'rxjs/Observable';
export declare type SnackBarState = 'initial' | 'visible' | 'complete' | 'void';
export declare const SHOW_ANIMATION: string;
export declare const HIDE_ANIMATION: string;
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
export declare class MdSnackBarContainer extends BasePortalHost implements OnDestroy {
    private _ngZone;
    /** The portal host inside of this container into which the snack bar content will be loaded. */
    _portalHost: PortalHostDirective;
    /** Subject for notifying that the snack bar has exited from view. */
    private onExit;
    /** Subject for notifying that the snack bar has finished entering the view. */
    private onEnter;
    /** The state of the snack bar animations. */
    animationState: SnackBarState;
    /** The snack bar configuration. */
    snackBarConfig: MdSnackBarConfig;
    constructor(_ngZone: NgZone);
    /** Attach a component portal as content to this snack bar container. */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** Attach a template portal as content to this snack bar container. */
    attachTemplatePortal(portal: TemplatePortal): Map<string, any>;
    /** Handle end of animations, updating the state of the snackbar. */
    onAnimationEnd(event: AnimationTransitionEvent): void;
    /** Begin animation of snack bar entrance into view. */
    enter(): void;
    /** Returns an observable resolving when the enter animation completes.  */
    _onEnter(): Observable<void>;
    /** Begin animation of the snack bar exiting from view. */
    exit(): Observable<void>;
    /** Returns an observable that completes after the closing animation is done. */
    _onExit(): Observable<void>;
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     */
    ngOnDestroy(): void;
}
