import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ContentContainerComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatCardHarness` instances. */
export declare interface CardHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /** Only find instances whose title matches the given value. */
    title?: string | RegExp;
    /** Only find instances whose subtitle matches the given value. */
    subtitle?: string | RegExp;
}

/** Harness for interacting with a standard mat-card in tests. */
export declare class MatCardHarness extends ContentContainerComponentHarness<MatCardSection> {
    /** The selector for the host element of a `MatCard` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCardHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CardHarnessFilters): HarnessPredicate<MatCardHarness>;
    private _title;
    private _subtitle;
    /** Gets all of the card's content as text. */
    getText(): Promise<string>;
    /** Gets the cards's title text. */
    getTitleText(): Promise<string>;
    /** Gets the cards's subtitle text. */
    getSubtitleText(): Promise<string>;
}

/** Selectors for different sections of the mat-card that can container user content. */
export declare const enum MatCardSection {
    HEADER = ".mat-card-header",
    CONTENT = ".mat-card-content",
    ACTIONS = ".mat-card-actions",
    FOOTER = ".mat-card-footer"
}

export { }
