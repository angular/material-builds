import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { ContentContainerComponentHarness } from '@angular/cdk/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';

export declare interface AccordionHarnessFilters extends BaseHarnessFilters {
}

export declare interface ExpansionPanelHarnessFilters extends BaseHarnessFilters {
    title?: string | RegExp | null;
    description?: string | RegExp | null;
    content?: string | RegExp;
    expanded?: boolean;
    disabled?: boolean;
}

/** Harness for interacting with a standard mat-accordion in tests. */
export declare class MatAccordionHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for an accordion
     * with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: AccordionHarnessFilters): HarnessPredicate<MatAccordionHarness>;
    /** Gets all expansion panels which are part of the accordion. */
    getExpansionPanels(filter?: ExpansionPanelHarnessFilters): Promise<MatExpansionPanelHarness[]>;
    /** Whether the accordion allows multiple expanded panels simultaneously. */
    isMulti(): Promise<boolean>;
}

/** Harness for interacting with a standard mat-expansion-panel in tests. */
export declare class MatExpansionPanelHarness extends ContentContainerComponentHarness<MatExpansionPanelSection> {
    static hostSelector: string;
    private _header;
    private _title;
    private _description;
    private _expansionIndicator;
    private _content;
    /**
     * Gets a `HarnessPredicate` that can be used to search for an expansion-panel
     * with specific attributes.
     * @param options Options for narrowing the search:
     *   - `title` finds an expansion-panel with a specific title text.
     *   - `description` finds an expansion-panel with a specific description text.
     *   - `expanded` finds an expansion-panel that is currently expanded.
     *   - `disabled` finds an expansion-panel that is disabled.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ExpansionPanelHarnessFilters): HarnessPredicate<MatExpansionPanelHarness>;
    /** Whether the panel is expanded. */
    isExpanded(): Promise<boolean>;
    /**
     * Gets the title text of the panel.
     * @returns Title text or `null` if no title is set up.
     */
    getTitle(): Promise<string | null>;
    /**
     * Gets the description text of the panel.
     * @returns Description text or `null` if no description is set up.
     */
    getDescription(): Promise<string | null>;
    /** Whether the panel is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Toggles the expanded state of the panel by clicking on the panel
     * header. This method will not work if the panel is disabled.
     */
    toggle(): Promise<void>;
    /** Expands the expansion panel if collapsed. */
    expand(): Promise<void>;
    /** Collapses the expansion panel if expanded. */
    collapse(): Promise<void>;
    /** Gets the text content of the panel. */
    getTextContent(): Promise<string>;
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for
     * components within the panel's content area.
     * @deprecated Use either `getChildLoader(MatExpansionPanelSection.CONTENT)`, `getHarness` or
     *    `getAllHarnesses` instead.
     * @breaking-change 12.0.0
     */
    getHarnessLoaderForContent(): Promise<HarnessLoader>;
    /** Focuses the panel. */
    focus(): Promise<void>;
    /** Blurs the panel. */
    blur(): Promise<void>;
    /** Whether the panel is focused. */
    isFocused(): Promise<boolean>;
    /** Whether the panel has a toggle indicator displayed. */
    hasToggleIndicator(): Promise<boolean>;
    /** Gets the position of the toggle indicator. */
    getToggleIndicatorPosition(): Promise<'before' | 'after'>;
}

/** Selectors for the various `mat-expansion-panel` sections that may contain user content. */
export declare enum MatExpansionPanelSection {
    HEADER = ".mat-expansion-panel-header",
    TITLE = ".mat-expansion-panel-header-title",
    DESCRIPTION = ".mat-expansion-panel-header-description",
    CONTENT = ".mat-expansion-panel-content"
}

export { }
