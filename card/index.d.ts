import * as i0 from '@angular/core';
import * as i1 from '@angular/material/core';
import { InjectionToken } from '@angular/core';

declare namespace i2 {
    export {
        MatCardAppearance,
        MatCardConfig,
        MAT_CARD_CONFIG,
        MatCard,
        MatCardTitle,
        MatCardTitleGroup,
        MatCardContent,
        MatCardSubtitle,
        MatCardActions,
        MatCardHeader,
        MatCardFooter,
        MatCardImage,
        MatCardSmImage,
        MatCardMdImage,
        MatCardLgImage,
        MatCardXlImage,
        MatCardAvatar
    }
}

/** Injection token that can be used to provide the default options the card module. */
export declare const MAT_CARD_CONFIG: InjectionToken<MatCardConfig>;

/**
 * Material Design card component. Cards contain content and actions about a single subject.
 * See https://material.io/design/components/cards.html
 *
 * MatCard provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCard {
    appearance: MatCardAppearance;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCard, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCard, "mat-card", ["matCard"], { "appearance": { "alias": "appearance"; "required": false; }; }, {}, never, ["*"], true, never>;
}

/**
 * Bottom area of a card that contains action buttons, intended for use within `<mat-card>`.
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-content>`; any custom action block element may be used in its place.
 *
 * MatCardActions provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardActions {
    /** Position of the actions inside the card. */
    align: 'start' | 'end';
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardActions, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardActions, "mat-card-actions", ["matCardActions"], { "align": { "alias": "align"; "required": false; }; }, {}, never, never, true, never>;
}

export declare type MatCardAppearance = 'outlined' | 'raised';

/**
 * Avatar image content for a card, intended for use within `<mat-card>`. Can be applied to
 * any media element, such as `<img>` or `<picture>`.
 *
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-title>`; any custom media element may be used in its place.
 *
 * MatCardAvatar provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardAvatar {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardAvatar, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardAvatar, "[mat-card-avatar], [matCardAvatar]", never, {}, {}, never, never, true, never>;
}

/** Object that can be used to configure the default options for the card module. */
export declare interface MatCardConfig {
    /** Default appearance for cards. */
    appearance?: MatCardAppearance;
}

/**
 * Content of a card, intended for use within `<mat-card>`. This component is an optional
 * convenience for use with other convenience elements, such as `<mat-card-title>`; any custom
 * content block element may be used in its place.
 *
 * MatCardContent provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardContent, "mat-card-content", never, {}, {}, never, never, true, never>;
}

/**
 * Footer area a card, intended for use within `<mat-card>`.
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-content>`; any custom footer block element may be used in its place.
 *
 * MatCardFooter provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardFooter {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardFooter, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardFooter, "mat-card-footer", never, {}, {}, never, never, true, never>;
}

/**
 * Header region of a card, intended for use within `<mat-card>`. This header captures
 * a card title, subtitle, and avatar.  This component is an optional convenience for use with
 * other convenience elements, such as `<mat-card-footer>`; any custom header block element may be
 * used in its place.
 *
 * MatCardHeader provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardHeader {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCardHeader, "mat-card-header", never, {}, {}, never, ["[mat-card-avatar], [matCardAvatar]", "mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "*"], true, never>;
}

/**
 * Primary image content for a card, intended for use within `<mat-card>`. Can be applied to
 * any media element, such as `<img>` or `<picture>`.
 *
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-content>`; any custom media element may be used in its place.
 *
 * MatCardImage provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardImage, "[mat-card-image], [matCardImage]", never, {}, {}, never, never, true, never>;
}

/** Same as `MatCardImage`, but large. */
export declare class MatCardLgImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardLgImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardLgImage, "[mat-card-lg-image], [matCardImageLarge]", never, {}, {}, never, never, true, never>;
}

/** Same as `MatCardImage`, but medium. */
export declare class MatCardMdImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardMdImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardMdImage, "[mat-card-md-image], [matCardImageMedium]", never, {}, {}, never, never, true, never>;
}

export declare class MatCardModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatCardModule, never, [typeof i1.MatCommonModule, typeof i2.MatCard, typeof i2.MatCardActions, typeof i2.MatCardAvatar, typeof i2.MatCardContent, typeof i2.MatCardFooter, typeof i2.MatCardHeader, typeof i2.MatCardImage, typeof i2.MatCardLgImage, typeof i2.MatCardMdImage, typeof i2.MatCardSmImage, typeof i2.MatCardSubtitle, typeof i2.MatCardTitle, typeof i2.MatCardTitleGroup, typeof i2.MatCardXlImage], [typeof i2.MatCard, typeof i2.MatCardActions, typeof i2.MatCardAvatar, typeof i2.MatCardContent, typeof i2.MatCardFooter, typeof i2.MatCardHeader, typeof i2.MatCardImage, typeof i2.MatCardLgImage, typeof i2.MatCardMdImage, typeof i2.MatCardSmImage, typeof i2.MatCardSubtitle, typeof i2.MatCardTitle, typeof i2.MatCardTitleGroup, typeof i2.MatCardXlImage, typeof i1.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatCardModule>;
}

/** Same as `MatCardImage`, but small. */
export declare class MatCardSmImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardSmImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardSmImage, "[mat-card-sm-image], [matCardImageSmall]", never, {}, {}, never, never, true, never>;
}

/**
 * Sub-title of a card, intended for use within `<mat-card>` beneath a `<mat-card-title>`. This
 * component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-title>`.
 *
 * MatCardSubtitle provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardSubtitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardSubtitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardSubtitle, "mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]", never, {}, {}, never, never, true, never>;
}

/**
 * Title of a card, intended for use within `<mat-card>`. This component is an optional
 * convenience for one variety of card title; any custom title element may be used in its place.
 *
 * MatCardTitle provides no behaviors, instead serving as a purely visual treatment.
 */
export declare class MatCardTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardTitle, "mat-card-title, [mat-card-title], [matCardTitle]", never, {}, {}, never, never, true, never>;
}

/**
 * Container intended to be used within the `<mat-card>` component. Can contain exactly one
 * `<mat-card-title>`, one `<mat-card-subtitle>` and one content image of any size
 * (e.g. `<img matCardLgImage>`).
 */
export declare class MatCardTitleGroup {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardTitleGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCardTitleGroup, "mat-card-title-group", never, {}, {}, never, ["mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "[mat-card-image], [matCardImage],\n                    [mat-card-sm-image], [matCardImageSmall],\n                    [mat-card-md-image], [matCardImageMedium],\n                    [mat-card-lg-image], [matCardImageLarge],\n                    [mat-card-xl-image], [matCardImageXLarge]", "*"], true, never>;
}

/** Same as `MatCardImage`, but extra-large. */
export declare class MatCardXlImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardXlImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardXlImage, "[mat-card-xl-image], [matCardImageXLarge]", never, {}, {}, never, never, true, never>;
}

export { }
