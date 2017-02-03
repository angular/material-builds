import { ElementRef, QueryList, TemplateRef } from '@angular/core';
import { MdOption } from '../core';
export declare type AutocompletePositionY = 'above' | 'below';
export declare class MdAutocomplete {
    /** Whether the autocomplete panel displays above or below its trigger. */
    positionY: AutocompletePositionY;
    template: TemplateRef<any>;
    panel: ElementRef;
    options: QueryList<MdOption>;
    /** Function that maps an option's control value to its display value in the trigger. */
    displayWith: (value: any) => string;
    /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
    id: string;
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display
     * options below the fold, as they are not actually being focused when active.
     */
    _setScrollTop(scrollTop: number): void;
    /** Sets a class on the panel based on its position (used to set y-offset). */
    _getPositionClass(): {
        'md-autocomplete-panel-below': boolean;
        'md-autocomplete-panel-above': boolean;
    };
}
