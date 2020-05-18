/**
 * @fileoverview added by tsickle
 * Generated from: src/material/form-field/form-field-control.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
/**
 * An interface which allows a control to work inside of a `MatFormField`.
 * @abstract
 * @template T
 */
let MatFormFieldControl = /** @class */ (() => {
    /**
     * An interface which allows a control to work inside of a `MatFormField`.
     * @abstract
     * @template T
     */
    class MatFormFieldControl {
    }
    MatFormFieldControl.decorators = [
        { type: Directive }
    ];
    return MatFormFieldControl;
})();
export { MatFormFieldControl };
if (false) {
    /**
     * The value of the control.
     * @type {?}
     */
    MatFormFieldControl.prototype.value;
    /**
     * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
     * needs to run change detection.
     * @type {?}
     */
    MatFormFieldControl.prototype.stateChanges;
    /**
     * The element ID for this control.
     * @type {?}
     */
    MatFormFieldControl.prototype.id;
    /**
     * The placeholder for this control.
     * @type {?}
     */
    MatFormFieldControl.prototype.placeholder;
    /**
     * Gets the NgControl for this control.
     * @type {?}
     */
    MatFormFieldControl.prototype.ngControl;
    /**
     * Whether the control is focused.
     * @type {?}
     */
    MatFormFieldControl.prototype.focused;
    /**
     * Whether the control is empty.
     * @type {?}
     */
    MatFormFieldControl.prototype.empty;
    /**
     * Whether the `MatFormField` label should try to float.
     * @type {?}
     */
    MatFormFieldControl.prototype.shouldLabelFloat;
    /**
     * Whether the control is required.
     * @type {?}
     */
    MatFormFieldControl.prototype.required;
    /**
     * Whether the control is disabled.
     * @type {?}
     */
    MatFormFieldControl.prototype.disabled;
    /**
     * Whether the control is in an error state.
     * @type {?}
     */
    MatFormFieldControl.prototype.errorState;
    /**
     * An optional name for the control type that can be used to distinguish `mat-form-field` elements
     * based on their control type. The form field will add a class,
     * `mat-form-field-type-{{controlType}}` to its root element.
     * @type {?}
     */
    MatFormFieldControl.prototype.controlType;
    /**
     * Whether the input is currently in an autofilled state. If property is not present on the
     * control it is assumed to be false.
     * @type {?}
     */
    MatFormFieldControl.prototype.autofilled;
    /**
     * Sets the list of element IDs that currently describe this control.
     * @abstract
     * @param {?} ids
     * @return {?}
     */
    MatFormFieldControl.prototype.setDescribedByIds = function (ids) { };
    /**
     * Handles a click on the control's container.
     * @abstract
     * @param {?} event
     * @return {?}
     */
    MatFormFieldControl.prototype.onContainerClick = function (event) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZm9ybS1maWVsZC1jb250cm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVVBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7OztBQUl4Qzs7Ozs7O0lBQUEsTUFDc0IsbUJBQW1COzs7Z0JBRHhDLFNBQVM7O0lBd0RWLDBCQUFDO0tBQUE7U0F2RHFCLG1CQUFtQjs7Ozs7O0lBRXZDLG9DQUFnQjs7Ozs7O0lBTWhCLDJDQUF3Qzs7Ozs7SUFHeEMsaUNBQW9COzs7OztJQUdwQiwwQ0FBNkI7Ozs7O0lBRzdCLHdDQUFxQzs7Ozs7SUFHckMsc0NBQTBCOzs7OztJQUcxQixvQ0FBd0I7Ozs7O0lBR3hCLCtDQUFtQzs7Ozs7SUFHbkMsdUNBQTJCOzs7OztJQUczQix1Q0FBMkI7Ozs7O0lBRzNCLHlDQUE2Qjs7Ozs7OztJQU83QiwwQ0FBOEI7Ozs7OztJQU05Qix5Q0FBOEI7Ozs7Ozs7SUFHOUIscUVBQWdEOzs7Ozs7O0lBR2hELHNFQUFtRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG4vKiogQW4gaW50ZXJmYWNlIHdoaWNoIGFsbG93cyBhIGNvbnRyb2wgdG8gd29yayBpbnNpZGUgb2YgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdEZvcm1GaWVsZENvbnRyb2w8VD4ge1xuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiAqL1xuICB2YWx1ZTogVCB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBzdGF0ZSBvZiB0aGUgY29udHJvbCBjaGFuZ2VzIHN1Y2ggdGhhdCB0aGUgcGFyZW50IGBNYXRGb3JtRmllbGRgXG4gICAqIG5lZWRzIHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gIC8qKiBUaGUgZWxlbWVudCBJRCBmb3IgdGhpcyBjb250cm9sLiAqL1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgcGxhY2Vob2xkZXIgZm9yIHRoaXMgY29udHJvbC4gKi9cbiAgcmVhZG9ubHkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogR2V0cyB0aGUgTmdDb250cm9sIGZvciB0aGlzIGNvbnRyb2wuICovXG4gIHJlYWRvbmx5IG5nQ29udHJvbDogTmdDb250cm9sIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBmb2N1c2VkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGVtcHR5LiAqL1xuICByZWFkb25seSBlbXB0eTogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgYE1hdEZvcm1GaWVsZGAgbGFiZWwgc2hvdWxkIHRyeSB0byBmbG9hdC4gKi9cbiAgcmVhZG9ubHkgc2hvdWxkTGFiZWxGbG9hdDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyByZXF1aXJlZC4gKi9cbiAgcmVhZG9ubHkgcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuICovXG4gIHJlYWRvbmx5IGRpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICByZWFkb25seSBlcnJvclN0YXRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBuYW1lIGZvciB0aGUgY29udHJvbCB0eXBlIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzdGluZ3Vpc2ggYG1hdC1mb3JtLWZpZWxkYCBlbGVtZW50c1xuICAgKiBiYXNlZCBvbiB0aGVpciBjb250cm9sIHR5cGUuIFRoZSBmb3JtIGZpZWxkIHdpbGwgYWRkIGEgY2xhc3MsXG4gICAqIGBtYXQtZm9ybS1maWVsZC10eXBlLXt7Y29udHJvbFR5cGV9fWAgdG8gaXRzIHJvb3QgZWxlbWVudC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRyb2xUeXBlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBjdXJyZW50bHkgaW4gYW4gYXV0b2ZpbGxlZCBzdGF0ZS4gSWYgcHJvcGVydHkgaXMgbm90IHByZXNlbnQgb24gdGhlXG4gICAqIGNvbnRyb2wgaXQgaXMgYXNzdW1lZCB0byBiZSBmYWxzZS5cbiAgICovXG4gIHJlYWRvbmx5IGF1dG9maWxsZWQ/OiBib29sZWFuO1xuXG4gIC8qKiBTZXRzIHRoZSBsaXN0IG9mIGVsZW1lbnQgSURzIHRoYXQgY3VycmVudGx5IGRlc2NyaWJlIHRoaXMgY29udHJvbC4gKi9cbiAgYWJzdHJhY3Qgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSk6IHZvaWQ7XG5cbiAgLyoqIEhhbmRsZXMgYSBjbGljayBvbiB0aGUgY29udHJvbCdzIGNvbnRhaW5lci4gKi9cbiAgYWJzdHJhY3Qgb25Db250YWluZXJDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQ7XG59XG4iXX0=