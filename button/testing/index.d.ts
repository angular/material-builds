import { BaseHarnessFilters, ContentContainerComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

/** Possible button appearances. */
type ButtonVariant = 'basic' | 'raised' | 'flat' | 'icon' | 'stroked' | 'fab' | 'mini-fab';
/** A set of criteria that can be used to filter a list of button harness instances. */
interface ButtonHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /** Only find instances with a variant. */
    variant?: ButtonVariant;
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}

/** Harness for interacting with a mat-button in tests. */
declare class MatButtonHarness extends ContentContainerComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a button with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a button whose host element matches the given selector.
     *   - `text` finds a button with specific text content.
     *   - `variant` finds buttons matching a specific variant.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatButtonHarness>(this: ComponentHarnessConstructor<T>, options?: ButtonHarnessFilters): HarnessPredicate<T>;
    /**
     * Clicks the button at the given position relative to its top-left.
     * @param relativeX The relative x position of the click.
     * @param relativeY The relative y position of the click.
     */
    click(relativeX: number, relativeY: number): Promise<void>;
    /** Clicks the button at its center. */
    click(location: 'center'): Promise<void>;
    /** Clicks the button. */
    click(): Promise<void>;
    /** Gets a boolean promise indicating if the button is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a promise for the button's label text. */
    getText(): Promise<string>;
    /** Focuses the button and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the button and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    /** Whether the button is focused. */
    isFocused(): Promise<boolean>;
    /** Gets the variant of the button. */
    getVariant(): Promise<ButtonVariant>;
}

export { MatButtonHarness };
export type { ButtonHarnessFilters, ButtonVariant };
