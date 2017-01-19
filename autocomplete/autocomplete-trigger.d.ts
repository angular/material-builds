import { ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Overlay } from '../core';
import { MdAutocomplete } from './autocomplete';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { Dir } from '../core/rtl/dir';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
/** The panel needs a slight y-offset to ensure the input underline displays. */
export declare const MD_AUTOCOMPLETE_PANEL_OFFSET: number;
export declare class MdAutocompleteTrigger implements OnDestroy {
    private _element;
    private _overlay;
    private _viewContainerRef;
    private _controlDir;
    private _dir;
    private _overlayRef;
    private _portal;
    private _panelOpen;
    autocomplete: MdAutocomplete;
    constructor(_element: ElementRef, _overlay: Overlay, _viewContainerRef: ViewContainerRef, _controlDir: NgControl, _dir: Dir);
    ngOnDestroy(): void;
    readonly panelOpen: boolean;
    /** Opens the autocomplete suggestion panel. */
    openPanel(): void;
    /** Closes the autocomplete suggestion panel. */
    closePanel(): void;
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected and when the backdrop is clicked.
     */
    readonly panelClosingActions: Observable<any>;
    /** Stream of autocomplete option selections. */
    readonly optionSelections: Observable<any>[];
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     */
    private _subscribeToClosingActions();
    /** Destroys the autocomplete suggestion panel. */
    private _destroyPanel();
    /**
    * This method closes the panel, and if a value is specified, also sets the associated
    * control to that value. It will also mark the control as dirty if this interaction
    * stemmed from the user.
    */
    private _setValueAndClose(event);
    private _createOverlay();
    private _getOverlayConfig();
    private _getOverlayPosition();
    /** Returns the width of the input element, so the panel width can match it. */
    private _getHostWidth();
}
