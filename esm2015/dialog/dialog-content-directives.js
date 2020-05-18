/**
 * @fileoverview added by tsickle
 * Generated from: src/material/dialog/dialog-content-directives.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, Optional, ElementRef, } from '@angular/core';
import { MatDialog } from './dialog';
import { MatDialogRef } from './dialog-ref';
/**
 * Counter used to generate unique IDs for dialog elements.
 * @type {?}
 */
let dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
let MatDialogClose = /** @class */ (() => {
    /**
     * Button that will close the current dialog.
     */
    class MatDialogClose {
        /**
         * @param {?} dialogRef
         * @param {?} _elementRef
         * @param {?} _dialog
         */
        constructor(dialogRef, _elementRef, _dialog) {
            this.dialogRef = dialogRef;
            this._elementRef = _elementRef;
            this._dialog = _dialog;
            /**
             * Default to "button" to prevents accidental form submits.
             */
            this.type = 'button';
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (!this.dialogRef) {
                // When this directive is included in a dialog via TemplateRef (rather than being
                // in a Component), the DialogRef isn't available via injection because embedded
                // views cannot be given a custom injector. Instead, we look up the DialogRef by
                // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
                // be resolved at constructor time.
                this.dialogRef = (/** @type {?} */ (getClosestDialog(this._elementRef, this._dialog.openDialogs)));
            }
        }
        /**
         * @param {?} changes
         * @return {?}
         */
        ngOnChanges(changes) {
            /** @type {?} */
            const proxiedChange = changes['_matDialogClose'] || changes['_matDialogCloseResult'];
            if (proxiedChange) {
                this.dialogResult = proxiedChange.currentValue;
            }
        }
    }
    MatDialogClose.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-dialog-close], [matDialogClose]',
                    exportAs: 'matDialogClose',
                    host: {
                        '(click)': 'dialogRef.close(dialogResult)',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.type]': 'type',
                    }
                },] }
    ];
    /** @nocollapse */
    MatDialogClose.ctorParameters = () => [
        { type: MatDialogRef, decorators: [{ type: Optional }] },
        { type: ElementRef },
        { type: MatDialog }
    ];
    MatDialogClose.propDecorators = {
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        type: [{ type: Input }],
        dialogResult: [{ type: Input, args: ['mat-dialog-close',] }],
        _matDialogClose: [{ type: Input, args: ['matDialogClose',] }]
    };
    return MatDialogClose;
})();
export { MatDialogClose };
if (false) {
    /**
     * Screenreader label for the button.
     * @type {?}
     */
    MatDialogClose.prototype.ariaLabel;
    /**
     * Default to "button" to prevents accidental form submits.
     * @type {?}
     */
    MatDialogClose.prototype.type;
    /**
     * Dialog close input.
     * @type {?}
     */
    MatDialogClose.prototype.dialogResult;
    /** @type {?} */
    MatDialogClose.prototype._matDialogClose;
    /** @type {?} */
    MatDialogClose.prototype.dialogRef;
    /**
     * @type {?}
     * @private
     */
    MatDialogClose.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatDialogClose.prototype._dialog;
}
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
let MatDialogTitle = /** @class */ (() => {
    /**
     * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
     */
    class MatDialogTitle {
        /**
         * @param {?} _dialogRef
         * @param {?} _elementRef
         * @param {?} _dialog
         */
        constructor(_dialogRef, _elementRef, _dialog) {
            this._dialogRef = _dialogRef;
            this._elementRef = _elementRef;
            this._dialog = _dialog;
            this.id = `mat-dialog-title-${dialogElementUid++}`;
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (!this._dialogRef) {
                this._dialogRef = (/** @type {?} */ (getClosestDialog(this._elementRef, this._dialog.openDialogs)));
            }
            if (this._dialogRef) {
                Promise.resolve().then((/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const container = this._dialogRef._containerInstance;
                    if (container && !container._ariaLabelledBy) {
                        container._ariaLabelledBy = this.id;
                    }
                }));
            }
        }
    }
    MatDialogTitle.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-dialog-title], [matDialogTitle]',
                    exportAs: 'matDialogTitle',
                    host: {
                        'class': 'mat-dialog-title',
                        '[id]': 'id',
                    },
                },] }
    ];
    /** @nocollapse */
    MatDialogTitle.ctorParameters = () => [
        { type: MatDialogRef, decorators: [{ type: Optional }] },
        { type: ElementRef },
        { type: MatDialog }
    ];
    MatDialogTitle.propDecorators = {
        id: [{ type: Input }]
    };
    return MatDialogTitle;
})();
export { MatDialogTitle };
if (false) {
    /** @type {?} */
    MatDialogTitle.prototype.id;
    /**
     * @type {?}
     * @private
     */
    MatDialogTitle.prototype._dialogRef;
    /**
     * @type {?}
     * @private
     */
    MatDialogTitle.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatDialogTitle.prototype._dialog;
}
/**
 * Scrollable content container of a dialog.
 */
let MatDialogContent = /** @class */ (() => {
    /**
     * Scrollable content container of a dialog.
     */
    class MatDialogContent {
    }
    MatDialogContent.decorators = [
        { type: Directive, args: [{
                    selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
                    host: { 'class': 'mat-dialog-content' }
                },] }
    ];
    return MatDialogContent;
})();
export { MatDialogContent };
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
let MatDialogActions = /** @class */ (() => {
    /**
     * Container for the bottom action buttons in a dialog.
     * Stays fixed to the bottom when scrolling.
     */
    class MatDialogActions {
    }
    MatDialogActions.decorators = [
        { type: Directive, args: [{
                    selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
                    host: { 'class': 'mat-dialog-actions' }
                },] }
    ];
    return MatDialogActions;
})();
export { MatDialogActions };
/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 * @param {?} element Element relative to which to look for a dialog.
 * @param {?} openDialogs References to the currently-open dialogs.
 * @return {?}
 */
function getClosestDialog(element, openDialogs) {
    /** @type {?} */
    let parent = element.nativeElement.parentElement;
    while (parent && !parent.classList.contains('mat-dialog-container')) {
        parent = parent.parentElement;
    }
    return parent ? openDialogs.find((/**
     * @param {?} dialog
     * @return {?}
     */
    dialog => dialog.id === (/** @type {?} */ (parent)).id)) : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBRVIsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQzs7Ozs7SUFHdEMsZ0JBQWdCLEdBQUcsQ0FBQzs7OztBQUt4Qjs7OztJQUFBLE1BU2EsY0FBYzs7Ozs7O1FBWXpCLFlBQ3FCLFNBQTRCLEVBQ3ZDLFdBQW9DLEVBQ3BDLE9BQWtCO1lBRlAsY0FBUyxHQUFULFNBQVMsQ0FBbUI7WUFDdkMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1lBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVc7Ozs7WUFWbkIsU0FBSSxHQUFrQyxRQUFRLENBQUM7UUFVekIsQ0FBQzs7OztRQUVoQyxRQUFRO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLGlGQUFpRjtnQkFDakYsZ0ZBQWdGO2dCQUNoRixnRkFBZ0Y7Z0JBQ2hGLG9GQUFvRjtnQkFDcEYsbUNBQW1DO2dCQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1CQUFBLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBQyxDQUFDO2FBQ2hGO1FBQ0gsQ0FBQzs7Ozs7UUFFRCxXQUFXLENBQUMsT0FBc0I7O2tCQUMxQixhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksT0FBTyxDQUFDLHVCQUF1QixDQUFDO1lBRXBGLElBQUks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RUFBRSxXQUFnQzs7UUFDdEYsTUFBTSxHQUF1QixPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWE7SUFFcEUsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO1FBQ25FLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0tBQy9CO0lBRUQsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJOzs7O0lBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLG1CQUFBLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDOUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEVsZW1lbnRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXREaWFsb2d9IGZyb20gJy4vZGlhbG9nJztcbmltcG9ydCB7TWF0RGlhbG9nUmVmfSBmcm9tICcuL2RpYWxvZy1yZWYnO1xuXG4vKiogQ291bnRlciB1c2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIGRpYWxvZyBlbGVtZW50cy4gKi9cbmxldCBkaWFsb2dFbGVtZW50VWlkID0gMDtcblxuLyoqXG4gKiBCdXR0b24gdGhhdCB3aWxsIGNsb3NlIHRoZSBjdXJyZW50IGRpYWxvZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1kaWFsb2ctY2xvc2VdLCBbbWF0RGlhbG9nQ2xvc2VdJyxcbiAgZXhwb3J0QXM6ICdtYXREaWFsb2dDbG9zZScsXG4gIGhvc3Q6IHtcbiAgICAnKGNsaWNrKSc6ICdkaWFsb2dSZWYuY2xvc2UoZGlhbG9nUmVzdWx0KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIudHlwZV0nOiAndHlwZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ2xvc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIC8qKiBTY3JlZW5yZWFkZXIgbGFiZWwgZm9yIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBEZWZhdWx0IHRvIFwiYnV0dG9uXCIgdG8gcHJldmVudHMgYWNjaWRlbnRhbCBmb3JtIHN1Ym1pdHMuICovXG4gIEBJbnB1dCgpIHR5cGU6ICdzdWJtaXQnIHwgJ2J1dHRvbicgfCAncmVzZXQnID0gJ2J1dHRvbic7XG5cbiAgLyoqIERpYWxvZyBjbG9zZSBpbnB1dC4gKi9cbiAgQElucHV0KCdtYXQtZGlhbG9nLWNsb3NlJykgZGlhbG9nUmVzdWx0OiBhbnk7XG5cbiAgQElucHV0KCdtYXREaWFsb2dDbG9zZScpIF9tYXREaWFsb2dDbG9zZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5kaWFsb2dSZWYpIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBkaXJlY3RpdmUgaXMgaW5jbHVkZWQgaW4gYSBkaWFsb2cgdmlhIFRlbXBsYXRlUmVmIChyYXRoZXIgdGhhbiBiZWluZ1xuICAgICAgLy8gaW4gYSBDb21wb25lbnQpLCB0aGUgRGlhbG9nUmVmIGlzbid0IGF2YWlsYWJsZSB2aWEgaW5qZWN0aW9uIGJlY2F1c2UgZW1iZWRkZWRcbiAgICAgIC8vIHZpZXdzIGNhbm5vdCBiZSBnaXZlbiBhIGN1c3RvbSBpbmplY3Rvci4gSW5zdGVhZCwgd2UgbG9vayB1cCB0aGUgRGlhbG9nUmVmIGJ5XG4gICAgICAvLyBJRC4gVGhpcyBtdXN0IG9jY3VyIGluIGBvbkluaXRgLCBhcyB0aGUgSUQgYmluZGluZyBmb3IgdGhlIGRpYWxvZyBjb250YWluZXIgd29uJ3RcbiAgICAgIC8vIGJlIHJlc29sdmVkIGF0IGNvbnN0cnVjdG9yIHRpbWUuXG4gICAgICB0aGlzLmRpYWxvZ1JlZiA9IGdldENsb3Nlc3REaWFsb2codGhpcy5fZWxlbWVudFJlZiwgdGhpcy5fZGlhbG9nLm9wZW5EaWFsb2dzKSE7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHByb3hpZWRDaGFuZ2UgPSBjaGFuZ2VzWydfbWF0RGlhbG9nQ2xvc2UnXSB8fCBjaGFuZ2VzWydfbWF0RGlhbG9nQ2xvc2VSZXN1bHQnXTtcblxuICAgIGlmIChwcm94aWVkQ2hhbmdlKSB7XG4gICAgICB0aGlzLmRpYWxvZ1Jlc3VsdCA9IHByb3hpZWRDaGFuZ2UuY3VycmVudFZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRpdGxlIG9mIGEgZGlhbG9nIGVsZW1lbnQuIFN0YXlzIGZpeGVkIHRvIHRoZSB0b3Agb2YgdGhlIGRpYWxvZyB3aGVuIHNjcm9sbGluZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1kaWFsb2ctdGl0bGVdLCBbbWF0RGlhbG9nVGl0bGVdJyxcbiAgZXhwb3J0QXM6ICdtYXREaWFsb2dUaXRsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy10aXRsZScsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dUaXRsZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LWRpYWxvZy10aXRsZS0ke2RpYWxvZ0VsZW1lbnRVaWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2cpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IGdldENsb3Nlc3REaWFsb2codGhpcy5fZWxlbWVudFJlZiwgdGhpcy5fZGlhbG9nLm9wZW5EaWFsb2dzKSE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2RpYWxvZ1JlZi5fY29udGFpbmVySW5zdGFuY2U7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lciAmJiAhY29udGFpbmVyLl9hcmlhTGFiZWxsZWRCeSkge1xuICAgICAgICAgIGNvbnRhaW5lci5fYXJpYUxhYmVsbGVkQnkgPSB0aGlzLmlkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIFNjcm9sbGFibGUgY29udGVudCBjb250YWluZXIgb2YgYSBkaWFsb2cuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFttYXQtZGlhbG9nLWNvbnRlbnRdLCBtYXQtZGlhbG9nLWNvbnRlbnQsIFttYXREaWFsb2dDb250ZW50XWAsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWRpYWxvZy1jb250ZW50J31cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29udGVudCB7fVxuXG5cbi8qKlxuICogQ29udGFpbmVyIGZvciB0aGUgYm90dG9tIGFjdGlvbiBidXR0b25zIGluIGEgZGlhbG9nLlxuICogU3RheXMgZml4ZWQgdG8gdGhlIGJvdHRvbSB3aGVuIHNjcm9sbGluZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1kaWFsb2ctYWN0aW9uc10sIG1hdC1kaWFsb2ctYWN0aW9ucywgW21hdERpYWxvZ0FjdGlvbnNdYCxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZGlhbG9nLWFjdGlvbnMnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dBY3Rpb25zIHt9XG5cblxuLyoqXG4gKiBGaW5kcyB0aGUgY2xvc2VzdCBNYXREaWFsb2dSZWYgdG8gYW4gZWxlbWVudCBieSBsb29raW5nIGF0IHRoZSBET00uXG4gKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IHJlbGF0aXZlIHRvIHdoaWNoIHRvIGxvb2sgZm9yIGEgZGlhbG9nLlxuICogQHBhcmFtIG9wZW5EaWFsb2dzIFJlZmVyZW5jZXMgdG8gdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gKi9cbmZ1bmN0aW9uIGdldENsb3Nlc3REaWFsb2coZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIG9wZW5EaWFsb2dzOiBNYXREaWFsb2dSZWY8YW55PltdKSB7XG4gIGxldCBwYXJlbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gIHdoaWxlIChwYXJlbnQgJiYgIXBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1kaWFsb2ctY29udGFpbmVyJykpIHtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQgPyBvcGVuRGlhbG9ncy5maW5kKGRpYWxvZyA9PiBkaWFsb2cuaWQgPT09IHBhcmVudCEuaWQpIDogbnVsbDtcbn1cbiJdfQ==