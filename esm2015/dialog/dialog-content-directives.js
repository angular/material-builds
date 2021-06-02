/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, Optional, ElementRef, } from '@angular/core';
import { MatDialog } from './dialog';
import { _closeDialogVia, MatDialogRef } from './dialog-ref';
/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
export class MatDialogClose {
    constructor(
    /**
     * Reference to the containing dialog.
     * @deprecated `dialogRef` property to become private.
     * @breaking-change 13.0.0
     */
    // The dialog title directive is always used in combination with a `MatDialogRef`.
    // tslint:disable-next-line: lightweight-tokens
    dialogRef, _elementRef, _dialog) {
        this.dialogRef = dialogRef;
        this._elementRef = _elementRef;
        this._dialog = _dialog;
        /** Default to "button" to prevents accidental form submits. */
        this.type = 'button';
    }
    ngOnInit() {
        if (!this.dialogRef) {
            // When this directive is included in a dialog via TemplateRef (rather than being
            // in a Component), the DialogRef isn't available via injection because embedded
            // views cannot be given a custom injector. Instead, we look up the DialogRef by
            // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
            // be resolved at constructor time.
            this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
    }
    ngOnChanges(changes) {
        const proxiedChange = changes['_matDialogClose'] || changes['_matDialogCloseResult'];
        if (proxiedChange) {
            this.dialogResult = proxiedChange.currentValue;
        }
    }
    _onButtonClick(event) {
        // Determinate the focus origin using the click event, because using the FocusMonitor will
        // result in incorrect origins. Most of the time, close buttons will be auto focused in the
        // dialog, and therefore clicking the button won't result in a focus change. This means that
        // the FocusMonitor won't detect any origin change, and will always output `program`.
        _closeDialogVia(this.dialogRef, event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse', this.dialogResult);
    }
}
MatDialogClose.decorators = [
    { type: Directive, args: [{
                selector: '[mat-dialog-close], [matDialogClose]',
                exportAs: 'matDialogClose',
                host: {
                    '(click)': '_onButtonClick($event)',
                    '[attr.aria-label]': 'ariaLabel || null',
                    '[attr.type]': 'type',
                }
            },] }
];
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
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
export class MatDialogTitle {
    constructor(
    // The dialog title directive is always used in combination with a `MatDialogRef`.
    // tslint:disable-next-line: lightweight-tokens
    _dialogRef, _elementRef, _dialog) {
        this._dialogRef = _dialogRef;
        this._elementRef = _elementRef;
        this._dialog = _dialog;
        /** Unique id for the dialog title. If none is supplied, it will be auto-generated. */
        this.id = `mat-dialog-title-${dialogElementUid++}`;
    }
    ngOnInit() {
        if (!this._dialogRef) {
            this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
        if (this._dialogRef) {
            Promise.resolve().then(() => {
                const container = this._dialogRef._containerInstance;
                if (container && !container._ariaLabelledBy) {
                    container._ariaLabelledBy = this.id;
                }
            });
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
MatDialogTitle.ctorParameters = () => [
    { type: MatDialogRef, decorators: [{ type: Optional }] },
    { type: ElementRef },
    { type: MatDialog }
];
MatDialogTitle.propDecorators = {
    id: [{ type: Input }]
};
/**
 * Scrollable content container of a dialog.
 */
export class MatDialogContent {
}
MatDialogContent.decorators = [
    { type: Directive, args: [{
                selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
                host: { 'class': 'mat-dialog-content' }
            },] }
];
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
export class MatDialogActions {
}
MatDialogActions.decorators = [
    { type: Directive, args: [{
                selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
                host: { 'class': 'mat-dialog-actions' }
            },] }
];
/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element, openDialogs) {
    let parent = element.nativeElement.parentElement;
    while (parent && !parent.classList.contains('mat-dialog-container')) {
        parent = parent.parentElement;
    }
    return parent ? openDialogs.find(dialog => dialog.id === parent.id) : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBRVIsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFM0QsK0RBQStEO0FBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCOztHQUVHO0FBVUgsTUFBTSxPQUFPLGNBQWM7SUFZekI7SUFFRTs7OztPQUlHO0lBQ0gsa0ZBQWtGO0lBQ2xGLCtDQUErQztJQUM1QixTQUE0QixFQUN2QyxXQUFvQyxFQUNwQyxPQUFrQjtRQUZQLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBQ3ZDLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFXO1FBbkI1QiwrREFBK0Q7UUFDdEQsU0FBSSxHQUFrQyxRQUFRLENBQUM7SUFrQnpCLENBQUM7SUFFaEMsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLGlGQUFpRjtZQUNqRixnRkFBZ0Y7WUFDaEYsZ0ZBQWdGO1lBQ2hGLG9GQUFvRjtZQUNwRixtQ0FBbUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFFLENBQUM7U0FDaEY7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLE1BQU0sYUFBYSxHQUFH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QUlEOzs7O0dBSUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLE9BQWdDLEVBQUUsV0FBZ0M7SUFDMUYsSUFBSSxNQUFNLEdBQXVCLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBRXJFLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTtRQUNuRSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ30gZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHtfY2xvc2VEaWFsb2dWaWEsIE1hdERpYWxvZ1JlZn0gZnJvbSAnLi9kaWFsb2ctcmVmJztcblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBkaWFsb2cgZWxlbWVudHMuICovXG5sZXQgZGlhbG9nRWxlbWVudFVpZCA9IDA7XG5cbi8qKlxuICogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgY3VycmVudCBkaWFsb2cuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLWNsb3NlXSwgW21hdERpYWxvZ0Nsb3NlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nQ2xvc2UnLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnX29uQnV0dG9uQ2xpY2soJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIudHlwZV0nOiAndHlwZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ2xvc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIC8qKiBTY3JlZW5yZWFkZXIgbGFiZWwgZm9yIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBEZWZhdWx0IHRvIFwiYnV0dG9uXCIgdG8gcHJldmVudHMgYWNjaWRlbnRhbCBmb3JtIHN1Ym1pdHMuICovXG4gIEBJbnB1dCgpIHR5cGU6ICdzdWJtaXQnIHwgJ2J1dHRvbicgfCAncmVzZXQnID0gJ2J1dHRvbic7XG5cbiAgLyoqIERpYWxvZyBjbG9zZSBpbnB1dC4gKi9cbiAgQElucHV0KCdtYXQtZGlhbG9nLWNsb3NlJykgZGlhbG9nUmVzdWx0OiBhbnk7XG5cbiAgQElucHV0KCdtYXREaWFsb2dDbG9zZScpIF9tYXREaWFsb2dDbG9zZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuXG4gICAgLyoqXG4gICAgICogUmVmZXJlbmNlIHRvIHRoZSBjb250YWluaW5nIGRpYWxvZy5cbiAgICAgKiBAZGVwcmVjYXRlZCBgZGlhbG9nUmVmYCBwcm9wZXJ0eSB0byBiZWNvbWUgcHJpdmF0ZS5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEzLjAuMFxuICAgICAqL1xuICAgIC8vIFRoZSBkaWFsb2cgdGl0bGUgZGlyZWN0aXZlIGlzIGFsd2F5cyB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggYSBgTWF0RGlhbG9nUmVmYC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGxpZ2h0d2VpZ2h0LXRva2Vuc1xuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5kaWFsb2dSZWYpIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBkaXJlY3RpdmUgaXMgaW5jbHVkZWQgaW4gYSBkaWFsb2cgdmlhIFRlbXBsYXRlUmVmIChyYXRoZXIgdGhhbiBiZWluZ1xuICAgICAgLy8gaW4gYSBDb21wb25lbnQpLCB0aGUgRGlhbG9nUmVmIGlzbid0IGF2YWlsYWJsZSB2aWEgaW5qZWN0aW9uIGJlY2F1c2UgZW1iZWRkZWRcbiAgICAgIC8vIHZpZXdzIGNhbm5vdCBiZSBnaXZlbiBhIGN1c3RvbSBpbmplY3Rvci4gSW5zdGVhZCwgd2UgbG9vayB1cCB0aGUgRGlhbG9nUmVmIGJ5XG4gICAgICAvLyBJRC4gVGhpcyBtdXN0IG9jY3VyIGluIGBvbkluaXRgLCBhcyB0aGUgSUQgYmluZGluZyBmb3IgdGhlIGRpYWxvZyBjb250YWluZXIgd29uJ3RcbiAgICAgIC8vIGJlIHJlc29sdmVkIGF0IGNvbnN0cnVjdG9yIHRpbWUuXG4gICAgICB0aGlzLmRpYWxvZ1JlZiA9IGdldENsb3Nlc3REaWFsb2codGhpcy5fZWxlbWVudFJlZiwgdGhpcy5fZGlhbG9nLm9wZW5EaWFsb2dzKSE7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHByb3hpZWRDaGFuZ2UgPSBjaGFuZ2VzWydfbWF0RGlhbG9nQ2xvc2UnXSB8fCBjaGFuZ2VzWydfbWF0RGlhbG9nQ2xvc2VSZXN1bHQnXTtcblxuICAgIGlmIChwcm94aWVkQ2hhbmdlKSB7XG4gICAgICB0aGlzLmRpYWxvZ1Jlc3VsdCA9IHByb3hpZWRDaGFuZ2UuY3VycmVudFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIF9vbkJ1dHRvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gRGV0ZXJtaW5hdGUgdGhlIGZvY3VzIG9yaWdpbiB1c2luZyB0aGUgY2xpY2sgZXZlbnQsIGJlY2F1c2UgdXNpbmcgdGhlIEZvY3VzTW9uaXRvciB3aWxsXG4gICAgLy8gcmVzdWx0IGluIGluY29ycmVjdCBvcmlnaW5zLiBNb3N0IG9mIHRoZSB0aW1lLCBjbG9zZSBidXR0b25zIHdpbGwgYmUgYXV0byBmb2N1c2VkIGluIHRoZVxuICAgIC8vIGRpYWxvZywgYW5kIHRoZXJlZm9yZSBjbGlja2luZyB0aGUgYnV0dG9uIHdvbid0IHJlc3VsdCBpbiBhIGZvY3VzIGNoYW5nZS4gVGhpcyBtZWFucyB0aGF0XG4gICAgLy8gdGhlIEZvY3VzTW9uaXRvciB3b24ndCBkZXRlY3QgYW55IG9yaWdpbiBjaGFuZ2UsIGFuZCB3aWxsIGFsd2F5cyBvdXRwdXQgYHByb2dyYW1gLlxuICAgIF9jbG9zZURpYWxvZ1ZpYSh0aGlzLmRpYWxvZ1JlZixcbiAgICAgICAgZXZlbnQuc2NyZWVuWCA9PT0gMCAmJiBldmVudC5zY3JlZW5ZID09PSAwID8gJ2tleWJvYXJkJyA6ICdtb3VzZScsIHRoaXMuZGlhbG9nUmVzdWx0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRpdGxlIG9mIGEgZGlhbG9nIGVsZW1lbnQuIFN0YXlzIGZpeGVkIHRvIHRoZSB0b3Agb2YgdGhlIGRpYWxvZyB3aGVuIHNjcm9sbGluZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1kaWFsb2ctdGl0bGVdLCBbbWF0RGlhbG9nVGl0bGVdJyxcbiAgZXhwb3J0QXM6ICdtYXREaWFsb2dUaXRsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy10aXRsZScsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dUaXRsZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBkaWFsb2cgdGl0bGUuIElmIG5vbmUgaXMgc3VwcGxpZWQsIGl0IHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQuICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LWRpYWxvZy10aXRsZS0ke2RpYWxvZ0VsZW1lbnRVaWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgLy8gVGhlIGRpYWxvZyB0aXRsZSBkaXJlY3RpdmUgaXMgYWx3YXlzIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBhIGBNYXREaWFsb2dSZWZgLlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4sXG4gICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYgPSBnZXRDbG9zZXN0RGlhbG9nKHRoaXMuX2VsZW1lbnRSZWYsIHRoaXMuX2RpYWxvZy5vcGVuRGlhbG9ncykhO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9kaWFsb2dSZWYuX2NvbnRhaW5lckluc3RhbmNlO1xuXG4gICAgICAgIGlmIChjb250YWluZXIgJiYgIWNvbnRhaW5lci5fYXJpYUxhYmVsbGVkQnkpIHtcbiAgICAgICAgICBjb250YWluZXIuX2FyaWFMYWJlbGxlZEJ5ID0gdGhpcy5pZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBTY3JvbGxhYmxlIGNvbnRlbnQgY29udGFpbmVyIG9mIGEgZGlhbG9nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LWRpYWxvZy1jb250ZW50XSwgbWF0LWRpYWxvZy1jb250ZW50LCBbbWF0RGlhbG9nQ29udGVudF1gLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1kaWFsb2ctY29udGVudCd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbnRlbnQge31cblxuXG4vKipcbiAqIENvbnRhaW5lciBmb3IgdGhlIGJvdHRvbSBhY3Rpb24gYnV0dG9ucyBpbiBhIGRpYWxvZy5cbiAqIFN0YXlzIGZpeGVkIHRvIHRoZSBib3R0b20gd2hlbiBzY3JvbGxpbmcuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFttYXQtZGlhbG9nLWFjdGlvbnNdLCBtYXQtZGlhbG9nLWFjdGlvbnMsIFttYXREaWFsb2dBY3Rpb25zXWAsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWRpYWxvZy1hY3Rpb25zJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQWN0aW9ucyB7fVxuXG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgTWF0RGlhbG9nUmVmIHRvIGFuIGVsZW1lbnQgYnkgbG9va2luZyBhdCB0aGUgRE9NLlxuICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCByZWxhdGl2ZSB0byB3aGljaCB0byBsb29rIGZvciBhIGRpYWxvZy5cbiAqIEBwYXJhbSBvcGVuRGlhbG9ncyBSZWZlcmVuY2VzIHRvIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICovXG5mdW5jdGlvbiBnZXRDbG9zZXN0RGlhbG9nKGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBvcGVuRGlhbG9nczogTWF0RGlhbG9nUmVmPGFueT5bXSkge1xuICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtZGlhbG9nLWNvbnRhaW5lcicpKSB7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gcGFyZW50ID8gb3BlbkRpYWxvZ3MuZmluZChkaWFsb2cgPT4gZGlhbG9nLmlkID09PSBwYXJlbnQhLmlkKSA6IG51bGw7XG59XG4iXX0=