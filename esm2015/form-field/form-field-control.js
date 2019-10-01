/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An interface which allows a control to work inside of a `MatFormField`.
 * @abstract
 * @template T
 */
export class MatFormFieldControl {
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZm9ybS1maWVsZC1jb250cm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxNQUFNLE9BQWdCLG1CQUFtQjtDQXVEeEM7Ozs7OztJQXJEQyxvQ0FBZ0I7Ozs7OztJQU1oQiwyQ0FBd0M7Ozs7O0lBR3hDLGlDQUFvQjs7Ozs7SUFHcEIsMENBQTZCOzs7OztJQUc3Qix3Q0FBcUM7Ozs7O0lBR3JDLHNDQUEwQjs7Ozs7SUFHMUIsb0NBQXdCOzs7OztJQUd4QiwrQ0FBbUM7Ozs7O0lBR25DLHVDQUEyQjs7Ozs7SUFHM0IsdUNBQTJCOzs7OztJQUczQix5Q0FBNkI7Ozs7Ozs7SUFPN0IsMENBQThCOzs7Ozs7SUFNOUIseUNBQThCOzs7Ozs7O0lBRzlCLHFFQUFnRDs7Ozs7OztJQUdoRCxzRUFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cblxuLyoqIEFuIGludGVyZmFjZSB3aGljaCBhbGxvd3MgYSBjb250cm9sIHRvIHdvcmsgaW5zaWRlIG9mIGEgYE1hdEZvcm1GaWVsZGAuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0Rm9ybUZpZWxkQ29udHJvbDxUPiB7XG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuICovXG4gIHZhbHVlOiBUIHwgbnVsbDtcblxuICAvKipcbiAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMgc3VjaCB0aGF0IHRoZSBwYXJlbnQgYE1hdEZvcm1GaWVsZGBcbiAgICogbmVlZHMgdG8gcnVuIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBzdGF0ZUNoYW5nZXM6IE9ic2VydmFibGU8dm9pZD47XG5cbiAgLyoqIFRoZSBlbGVtZW50IElEIGZvciB0aGlzIGNvbnRyb2wuICovXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBwbGFjZWhvbGRlciBmb3IgdGhpcyBjb250cm9sLiAqL1xuICByZWFkb25seSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKiBHZXRzIHRoZSBOZ0NvbnRyb2wgZm9yIHRoaXMgY29udHJvbC4gKi9cbiAgcmVhZG9ubHkgbmdDb250cm9sOiBOZ0NvbnRyb2wgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZW1wdHkuICovXG4gIHJlYWRvbmx5IGVtcHR5OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBgTWF0Rm9ybUZpZWxkYCBsYWJlbCBzaG91bGQgdHJ5IHRvIGZsb2F0LiAqL1xuICByZWFkb25seSBzaG91bGRMYWJlbEZsb2F0OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIHJlcXVpcmVkLiAqL1xuICByZWFkb25seSByZXF1aXJlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC4gKi9cbiAgcmVhZG9ubHkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgaW4gYW4gZXJyb3Igc3RhdGUuICovXG4gIHJlYWRvbmx5IGVycm9yU3RhdGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIG5hbWUgZm9yIHRoZSBjb250cm9sIHR5cGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkaXN0aW5ndWlzaCBgbWF0LWZvcm0tZmllbGRgIGVsZW1lbnRzXG4gICAqIGJhc2VkIG9uIHRoZWlyIGNvbnRyb2wgdHlwZS4gVGhlIGZvcm0gZmllbGQgd2lsbCBhZGQgYSBjbGFzcyxcbiAgICogYG1hdC1mb3JtLWZpZWxkLXR5cGUte3tjb250cm9sVHlwZX19YCB0byBpdHMgcm9vdCBlbGVtZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgY29udHJvbFR5cGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGN1cnJlbnRseSBpbiBhbiBhdXRvZmlsbGVkIHN0YXRlLiBJZiBwcm9wZXJ0eSBpcyBub3QgcHJlc2VudCBvbiB0aGVcbiAgICogY29udHJvbCBpdCBpcyBhc3N1bWVkIHRvIGJlIGZhbHNlLlxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b2ZpbGxlZD86IGJvb2xlYW47XG5cbiAgLyoqIFNldHMgdGhlIGxpc3Qgb2YgZWxlbWVudCBJRHMgdGhhdCBjdXJyZW50bHkgZGVzY3JpYmUgdGhpcyBjb250cm9sLiAqL1xuICBhYnN0cmFjdCBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKTogdm9pZDtcblxuICAvKiogSGFuZGxlcyBhIGNsaWNrIG9uIHRoZSBjb250cm9sJ3MgY29udGFpbmVyLiAqL1xuICBhYnN0cmFjdCBvbkNvbnRhaW5lckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZDtcbn1cbiJdfQ==