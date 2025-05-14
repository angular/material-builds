import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Base class for custom form-field control harnesses. Harnesses for
 * custom controls with form-fields need to implement this interface.
 */
declare abstract class MatFormFieldControlHarness extends ComponentHarness {
}
/**
 * Shared behavior for `MatFormFieldControlHarness` implementations
 */
declare abstract class MatFormFieldControlHarnessBase extends MatFormFieldControlHarness {
    private readonly _floatingLabelSelector;
    /** Gets the text content of the floating label, if it exists. */
    getLabel(): Promise<string | null>;
}

export { MatFormFieldControlHarness as M, MatFormFieldControlHarnessBase as a };
