import { Observable } from 'rxjs';
import { NgControl, AbstractControlDirective } from '@angular/forms';
import * as i0 from '@angular/core';
import { Signal } from '@angular/core';
import { Field } from '@angular/forms/signals';

/** An interface which allows a control to work inside of a `MatFormField`. */
declare abstract class MatFormFieldControl<T> {
    /** The element ID for this control. */
    readonly id: string;
    /** Control if the directive supports signal forms. */
    readonly ngField?: Field<T> | null;
    /**
     * Form control if the directive only supports Reactive or Template-driven forms.
     * Can be skipped if your directive already sets `ngField`.
     */
    readonly ngControl: NgControl | AbstractControlDirective | null;
    /** Whether the control is focused. */
    readonly focused: boolean | Signal<boolean>;
    /** Whether the control is empty. */
    readonly empty: boolean | Signal<boolean>;
    /** Whether the `MatFormField` label should try to float. */
    readonly shouldLabelFloat: boolean | Signal<boolean>;
    /** Whether the control is required. */
    readonly required: boolean | Signal<boolean>;
    /** Whether the control is disabled. */
    readonly disabled: boolean | Signal<boolean>;
    /** Whether the control is in an error state. */
    readonly errorState: boolean | Signal<boolean>;
    /**
     * An optional name for the control type that can be used to distinguish `mat-form-field` elements
     * based on their control type. The form field will add a class,
     * `mat-form-field-type-{{controlType}}` to its root element.
     */
    readonly controlType?: string;
    /**
     * Whether the input is currently in an autofilled state. If property is not present on the
     * control it is assumed to be false.
     */
    readonly autofilled?: boolean | Signal<boolean>;
    /**
     * Value of `aria-describedby` that should be merged with the described-by ids
     * which are set by the form-field.
     */
    readonly userAriaDescribedBy?: string | Signal<string>;
    /**
     * Whether to automatically assign the ID of the form field as the `for` attribute
     * on the `<label>` inside the form field. Set this to true to prevent the form
     * field from associating the label with non-native elements.
     */
    readonly disableAutomaticLabeling?: boolean;
    /** Gets the list of element IDs that currently describe this control. */
    readonly describedByIds?: string[];
    /**
     * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
     * needs to run change detection. Not necessary if the control is signal-based.
     */
    readonly stateChanges?: Observable<void> | null;
    /** Sets the list of element IDs that currently describe this control. */
    abstract setDescribedByIds(ids: string[]): void;
    /** Handles a click on the control's container. */
    abstract onContainerClick(event: MouseEvent): void;
    /** Value of the form control. Left in for backwards compatibility. */
    value?: any;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldControl<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFormFieldControl<any>, never, never, {}, {}, never, never, true, never>;
}

export { MatFormFieldControl };
