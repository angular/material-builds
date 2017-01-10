import { ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Overlay } from '../core';
import { MdAutocomplete } from './autocomplete';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
/** The panel needs a slight y-offset to ensure the input underline displays. */
export declare const MD_AUTOCOMPLETE_PANEL_OFFSET: number;
export declare class MdAutocompleteTrigger implements OnDestroy {
    private _element;
    private _overlay;
    private _viewContainerRef;
    private _overlayRef;
    private _portal;
    private _panelOpen;
    /** The subscription to events that close the autocomplete panel. */
    private _closingActionsSubscription;
    autocomplete: MdAutocomplete;
    constructor(_element: ElementRef, _overlay: Overlay, _viewContainerRef: ViewContainerRef);
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
    /** Destroys the autocomplete suggestion panel. */
    private _destroyPanel();
    private _createOverlay();
    private _getOverlayConfig();
    private _getOverlayPosition();
    /** Returns the width of the input element, so the panel width can match it. */
    private _getHostWidth();
}
