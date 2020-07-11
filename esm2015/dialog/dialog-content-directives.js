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
    constructor(dialogRef, _elementRef, _dialog) {
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
    constructor(_dialogRef, _elementRef, _dialog) {
        this._dialogRef = _dialogRef;
        this._elementRef = _elementRef;
        this._dialog = _dialog;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBRVIsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFM0QsK0RBQStEO0FBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCOztHQUVHO0FBVUgsTUFBTSxPQUFPLGNBQWM7SUFZekIsWUFDcUIsU0FBNEIsRUFDdkMsV0FBb0MsRUFDcEMsT0FBa0I7UUFGUCxjQUFTLEdBQVQsU0FBUyxDQUFtQjtRQUN2QyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQVg1QiwrREFBK0Q7UUFDdEQsU0FBSSxHQUFrQyxRQUFRLENBQUM7SUFVekIsQ0FBQztJQUVoQyxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsaUZBQWlGO1lBQ2pGLGdGQUFnRjtZQUNoRixnRkFBZ0Y7WUFDaEYsb0ZBQW9GO1lBQ3BGLG1DQUFtQztZQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUUsQ0FBQztTQUNoRjtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksT0FBTyxDQUFDLHVC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Q0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBRXJFLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTtRQUNuRSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ30gZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHtfY2xvc2VEaWFsb2dWaWEsIE1hdERpYWxvZ1JlZn0gZnJvbSAnLi9kaWFsb2ctcmVmJztcblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBkaWFsb2cgZWxlbWVudHMuICovXG5sZXQgZGlhbG9nRWxlbWVudFVpZCA9IDA7XG5cbi8qKlxuICogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgY3VycmVudCBkaWFsb2cuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLWNsb3NlXSwgW21hdERpYWxvZ0Nsb3NlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nQ2xvc2UnLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnX29uQnV0dG9uQ2xpY2soJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIudHlwZV0nOiAndHlwZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ2xvc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIC8qKiBTY3JlZW5yZWFkZXIgbGFiZWwgZm9yIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBEZWZhdWx0IHRvIFwiYnV0dG9uXCIgdG8gcHJldmVudHMgYWNjaWRlbnRhbCBmb3JtIHN1Ym1pdHMuICovXG4gIEBJbnB1dCgpIHR5cGU6ICdzdWJtaXQnIHwgJ2J1dHRvbicgfCAncmVzZXQnID0gJ2J1dHRvbic7XG5cbiAgLyoqIERpYWxvZyBjbG9zZSBpbnB1dC4gKi9cbiAgQElucHV0KCdtYXQtZGlhbG9nLWNsb3NlJykgZGlhbG9nUmVzdWx0OiBhbnk7XG5cbiAgQElucHV0KCdtYXREaWFsb2dDbG9zZScpIF9tYXREaWFsb2dDbG9zZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5kaWFsb2dSZWYpIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBkaXJlY3RpdmUgaXMgaW5jbHVkZWQgaW4gYSBkaWFsb2cgdmlhIFRlbXBsYXRlUmVmIChyYXRoZXIgdGhhbiBiZWluZ1xuICAgICAgLy8gaW4gYSBDb21wb25lbnQpLCB0aGUgRGlhbG9nUmVmIGlzbid0IGF2YWlsYWJsZSB2aWEgaW5qZWN0aW9uIGJlY2F1c2UgZW1iZWRkZWRcbiAgICAgIC8vIHZpZXdzIGNhbm5vdCBiZSBnaXZlbiBhIGN1c3RvbSBpbmplY3Rvci4gSW5zdGVhZCwgd2UgbG9vayB1cCB0aGUgRGlhbG9nUmVmIGJ5XG4gICAgICAvLyBJRC4gVGhpcyBtdXN0IG9jY3VyIGluIGBvbkluaXRgLCBhcyB0aGUgSUQgYmluZGluZyBmb3IgdGhlIGRpYWxvZyBjb250YWluZXIgd29uJ3RcbiAgICAgIC8vIGJlIHJlc29sdmVkIGF0IGNvbnN0cnVjdG9yIHRpbWUuXG4gICAgICB0aGlzLmRpYWxvZ1JlZiA9IGdldENsb3Nlc3REaWFsb2codGhpcy5fZWxlbWVudFJlZiwgdGhpcy5fZGlhbG9nLm9wZW5EaWFsb2dzKSE7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHByb3hpZWRDaGFuZ2UgPSBjaGFuZ2VzWydfbWF0RGlhbG9nQ2xvc2UnXSB8fCBjaGFuZ2VzWydfbWF0RGlhbG9nQ2xvc2VSZXN1bHQnXTtcblxuICAgIGlmIChwcm94aWVkQ2hhbmdlKSB7XG4gICAgICB0aGlzLmRpYWxvZ1Jlc3VsdCA9IHByb3hpZWRDaGFuZ2UuY3VycmVudFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIF9vbkJ1dHRvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gRGV0ZXJtaW5hdGUgdGhlIGZvY3VzIG9yaWdpbiB1c2luZyB0aGUgY2xpY2sgZXZlbnQsIGJlY2F1c2UgdXNpbmcgdGhlIEZvY3VzTW9uaXRvciB3aWxsXG4gICAgLy8gcmVzdWx0IGluIGluY29ycmVjdCBvcmlnaW5zLiBNb3N0IG9mIHRoZSB0aW1lLCBjbG9zZSBidXR0b25zIHdpbGwgYmUgYXV0byBmb2N1c2VkIGluIHRoZVxuICAgIC8vIGRpYWxvZywgYW5kIHRoZXJlZm9yZSBjbGlja2luZyB0aGUgYnV0dG9uIHdvbid0IHJlc3VsdCBpbiBhIGZvY3VzIGNoYW5nZS4gVGhpcyBtZWFucyB0aGF0XG4gICAgLy8gdGhlIEZvY3VzTW9uaXRvciB3b24ndCBkZXRlY3QgYW55IG9yaWdpbiBjaGFuZ2UsIGFuZCB3aWxsIGFsd2F5cyBvdXRwdXQgYHByb2dyYW1gLlxuICAgIF9jbG9zZURpYWxvZ1ZpYSh0aGlzLmRpYWxvZ1JlZixcbiAgICAgICAgZXZlbnQuc2NyZWVuWCA9PT0gMCAmJiBldmVudC5zY3JlZW5ZID09PSAwID8gJ2tleWJvYXJkJyA6ICdtb3VzZScsIHRoaXMuZGlhbG9nUmVzdWx0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRpdGxlIG9mIGEgZGlhbG9nIGVsZW1lbnQuIFN0YXlzIGZpeGVkIHRvIHRoZSB0b3Agb2YgdGhlIGRpYWxvZyB3aGVuIHNjcm9sbGluZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1kaWFsb2ctdGl0bGVdLCBbbWF0RGlhbG9nVGl0bGVdJyxcbiAgZXhwb3J0QXM6ICdtYXREaWFsb2dUaXRsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy10aXRsZScsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dUaXRsZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LWRpYWxvZy10aXRsZS0ke2RpYWxvZ0VsZW1lbnRVaWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2cpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IGdldENsb3Nlc3REaWFsb2codGhpcy5fZWxlbWVudFJlZiwgdGhpcy5fZGlhbG9nLm9wZW5EaWFsb2dzKSE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2RpYWxvZ1JlZi5fY29udGFpbmVySW5zdGFuY2U7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lciAmJiAhY29udGFpbmVyLl9hcmlhTGFiZWxsZWRCeSkge1xuICAgICAgICAgIGNvbnRhaW5lci5fYXJpYUxhYmVsbGVkQnkgPSB0aGlzLmlkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIFNjcm9sbGFibGUgY29udGVudCBjb250YWluZXIgb2YgYSBkaWFsb2cuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFttYXQtZGlhbG9nLWNvbnRlbnRdLCBtYXQtZGlhbG9nLWNvbnRlbnQsIFttYXREaWFsb2dDb250ZW50XWAsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWRpYWxvZy1jb250ZW50J31cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29udGVudCB7fVxuXG5cbi8qKlxuICogQ29udGFpbmVyIGZvciB0aGUgYm90dG9tIGFjdGlvbiBidXR0b25zIGluIGEgZGlhbG9nLlxuICogU3RheXMgZml4ZWQgdG8gdGhlIGJvdHRvbSB3aGVuIHNjcm9sbGluZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1kaWFsb2ctYWN0aW9uc10sIG1hdC1kaWFsb2ctYWN0aW9ucywgW21hdERpYWxvZ0FjdGlvbnNdYCxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZGlhbG9nLWFjdGlvbnMnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dBY3Rpb25zIHt9XG5cblxuLyoqXG4gKiBGaW5kcyB0aGUgY2xvc2VzdCBNYXREaWFsb2dSZWYgdG8gYW4gZWxlbWVudCBieSBsb29raW5nIGF0IHRoZSBET00uXG4gKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IHJlbGF0aXZlIHRvIHdoaWNoIHRvIGxvb2sgZm9yIGEgZGlhbG9nLlxuICogQHBhcmFtIG9wZW5EaWFsb2dzIFJlZmVyZW5jZXMgdG8gdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gKi9cbmZ1bmN0aW9uIGdldENsb3Nlc3REaWFsb2coZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIG9wZW5EaWFsb2dzOiBNYXREaWFsb2dSZWY8YW55PltdKSB7XG4gIGxldCBwYXJlbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gIHdoaWxlIChwYXJlbnQgJiYgIXBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1kaWFsb2ctY29udGFpbmVyJykpIHtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQgPyBvcGVuRGlhbG9ncy5maW5kKGRpYWxvZyA9PiBkaWFsb2cuaWQgPT09IHBhcmVudCEuaWQpIDogbnVsbDtcbn1cbiJdfQ==