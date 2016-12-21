import { ModuleWithProviders } from '@angular/core';
/**
 * Content of a card, needed as it's used as a selector in the API.
 */
export declare class MdCardContent {
}
/**
 * Title of a card, needed as it's used as a selector in the API.
 */
export declare class MdCardTitle {
}
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 */
export declare class MdCardSubtitle {
}
/**
 * Action section of a card, needed as it's used as a selector in the API.
 */
export declare class MdCardActions {
}
/**
 * Footer of a card, needed as it's used as a selector in the API.
 */
export declare class MdCardFooter {
}
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - md-card-title
 * - md-card-subtitle
 * - md-card-content
 * - md-card-actions
 * - md-card-footer
 */
export declare class MdCard {
}
/**
 * Component intended to be used within the `<md-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 */
export declare class MdCardHeader {
}
/**
 * Component intended to be used within the <md-card> component. It adds styles for a preset
 * layout that groups an image with a title section.
 */
export declare class MdCardTitleGroup {
}
export declare class MdCardModule {
    static forRoot(): ModuleWithProviders;
}
