import { AsyncFactoryFn } from '@angular/cdk/testing';
import { BaseHarnessFilters } from '@angular/cdk/testing';
import { ComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { TestElement } from '@angular/cdk/testing';

/** Harness for interacting with a standard mat-slide-toggle in tests. */
export declare class MatSlideToggleHarness extends _MatSlideToggleHarnessBase {
    private _inputContainer;
    protected _nativeElement: AsyncFactoryFn<TestElement>;
    /** The selector for the host element of a `MatSlideToggle` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSlideToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which slide toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SlideToggleHarnessFilters): HarnessPredicate<MatSlideToggleHarness>;
    /** Toggle the checked state of the slide-toggle. */
    toggle(): Promise<void>;
    /** Whether the slide-toggle is checked. */
    isChecked(): Promise<boolean>;
}

export declare abstract class _MatSlideToggleHarnessBase extends ComponentHarness {
    private _label;
    protected abstract _nativeElement: AsyncFactoryFn<TestElement>;
    /** Toggle the checked state of the slide-toggle. */
    abstract toggle(): Promise<void>;
    /** Whether the slide-toggle is checked. */
    abstract isChecked(): Promise<boolean>;
    /** Whether the slide-toggle is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the slide-toggle is required. */
    isRequired(): Promise<boolean>;
    /** Whether the slide-toggle is valid. */
    isValid(): Promise<boolean>;
    /** Gets the slide-toggle's name. */
    getName(): Promise<string | null>;
    /** Gets the slide-toggle's aria-label. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the slide-toggle's aria-labelledby. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets the slide-toggle's label text. */
    getLabelText(): Promise<string>;
    /** Focuses the slide-toggle. */
    focus(): Promise<void>;
    /** Blurs the slide-toggle. */
    blur(): Promise<void>;
    /** Whether the slide-toggle is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    check(): Promise<void>;
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    uncheck(): Promise<void>;
}

/** A set of criteria that can be used to filter a list of `MatSlideToggleHarness` instances. */
export declare interface SlideToggleHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose label matches the given value. */
    label?: string | RegExp;
    /** Only find instances whose name is the given value. */
    name?: string;
    /** Only find instances with the given checked value. */
    checked?: boolean;
    /** Only find instances where the disabled state matches the given value. */
    disabled?: boolean;
}

export { }
