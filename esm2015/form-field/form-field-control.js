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
export class MatFormFieldControl {
}
MatFormFieldControl.decorators = [
    { type: Directive }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZm9ybS1maWVsZC1jb250cm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVVBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7OztBQUt4QyxNQUFNLE9BQWdCLG1CQUFtQjs7O1lBRHhDLFNBQVM7Ozs7Ozs7SUFHUixvQ0FBZ0I7Ozs7OztJQU1oQiwyQ0FBd0M7Ozs7O0lBR3hDLGlDQUFvQjs7Ozs7SUFHcEIsMENBQTZCOzs7OztJQUc3Qix3Q0FBcUM7Ozs7O0lBR3JDLHNDQUEwQjs7Ozs7SUFHMUIsb0NBQXdCOzs7OztJQUd4QiwrQ0FBbUM7Ozs7O0lBR25DLHVDQUEyQjs7Ozs7SUFHM0IsdUNBQTJCOzs7OztJQUczQix5Q0FBNkI7Ozs7Ozs7SUFPN0IsMENBQThCOzs7Ozs7SUFNOUIseUNBQThCOzs7Ozs7O0lBRzlCLHFFQUFnRDs7Ozs7OztJQUdoRCxzRUFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuLyoqIEFuIGludGVyZmFjZSB3aGljaCBhbGxvd3MgYSBjb250cm9sIHRvIHdvcmsgaW5zaWRlIG9mIGEgYE1hdEZvcm1GaWVsZGAuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRGb3JtRmllbGRDb250cm9sPFQ+IHtcbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbC4gKi9cbiAgdmFsdWU6IFQgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgc3RhdGUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcyBzdWNoIHRoYXQgdGhlIHBhcmVudCBgTWF0Rm9ybUZpZWxkYFxuICAgKiBuZWVkcyB0byBydW4gY2hhbmdlIGRldGVjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogT2JzZXJ2YWJsZTx2b2lkPjtcblxuICAvKiogVGhlIGVsZW1lbnQgSUQgZm9yIHRoaXMgY29udHJvbC4gKi9cbiAgcmVhZG9ubHkgaWQ6IHN0cmluZztcblxuICAvKiogVGhlIHBsYWNlaG9sZGVyIGZvciB0aGlzIGNvbnRyb2wuICovXG4gIHJlYWRvbmx5IHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqIEdldHMgdGhlIE5nQ29udHJvbCBmb3IgdGhpcyBjb250cm9sLiAqL1xuICByZWFkb25seSBuZ0NvbnRyb2w6IE5nQ29udHJvbCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgZm9jdXNlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBlbXB0eS4gKi9cbiAgcmVhZG9ubHkgZW1wdHk6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGBNYXRGb3JtRmllbGRgIGxhYmVsIHNob3VsZCB0cnkgdG8gZmxvYXQuICovXG4gIHJlYWRvbmx5IHNob3VsZExhYmVsRmxvYXQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgcmVxdWlyZWQuICovXG4gIHJlYWRvbmx5IHJlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLiAqL1xuICByZWFkb25seSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbCBpcyBpbiBhbiBlcnJvciBzdGF0ZS4gKi9cbiAgcmVhZG9ubHkgZXJyb3JTdGF0ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgbmFtZSBmb3IgdGhlIGNvbnRyb2wgdHlwZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRpc3Rpbmd1aXNoIGBtYXQtZm9ybS1maWVsZGAgZWxlbWVudHNcbiAgICogYmFzZWQgb24gdGhlaXIgY29udHJvbCB0eXBlLiBUaGUgZm9ybSBmaWVsZCB3aWxsIGFkZCBhIGNsYXNzLFxuICAgKiBgbWF0LWZvcm0tZmllbGQtdHlwZS17e2NvbnRyb2xUeXBlfX1gIHRvIGl0cyByb290IGVsZW1lbnQuXG4gICAqL1xuICByZWFkb25seSBjb250cm9sVHlwZT86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgaW5wdXQgaXMgY3VycmVudGx5IGluIGFuIGF1dG9maWxsZWQgc3RhdGUuIElmIHByb3BlcnR5IGlzIG5vdCBwcmVzZW50IG9uIHRoZVxuICAgKiBjb250cm9sIGl0IGlzIGFzc3VtZWQgdG8gYmUgZmFsc2UuXG4gICAqL1xuICByZWFkb25seSBhdXRvZmlsbGVkPzogYm9vbGVhbjtcblxuICAvKiogU2V0cyB0aGUgbGlzdCBvZiBlbGVtZW50IElEcyB0aGF0IGN1cnJlbnRseSBkZXNjcmliZSB0aGlzIGNvbnRyb2wuICovXG4gIGFic3RyYWN0IHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pOiB2b2lkO1xuXG4gIC8qKiBIYW5kbGVzIGEgY2xpY2sgb24gdGhlIGNvbnRyb2wncyBjb250YWluZXIuICovXG4gIGFic3RyYWN0IG9uQ29udGFpbmVyQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkO1xufVxuIl19