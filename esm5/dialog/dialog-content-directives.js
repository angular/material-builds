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
/** Counter used to generate unique IDs for dialog elements. */
var dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
var MatDialogClose = /** @class */ (function () {
    function MatDialogClose(dialogRef, _elementRef, _dialog) {
        this.dialogRef = dialogRef;
        this._elementRef = _elementRef;
        this._dialog = _dialog;
        /** Default to "button" to prevents accidental form submits. */
        this.type = 'button';
    }
    MatDialogClose.prototype.ngOnInit = function () {
        if (!this.dialogRef) {
            // When this directive is included in a dialog via TemplateRef (rather than being
            // in a Component), the DialogRef isn't available via injection because embedded
            // views cannot be given a custom injector. Instead, we look up the DialogRef by
            // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
            // be resolved at constructor time.
            this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
    };
    MatDialogClose.prototype.ngOnChanges = function (changes) {
        var proxiedChange = changes['_matDialogClose'] || changes['_matDialogCloseResult'];
        if (proxiedChange) {
            this.dialogResult = proxiedChange.currentValue;
        }
    };
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
    MatDialogClose.ctorParameters = function () { return [
        { type: MatDialogRef, decorators: [{ type: Optional }] },
        { type: ElementRef },
        { type: MatDialog }
    ]; };
    MatDialogClose.propDecorators = {
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        type: [{ type: Input }],
        dialogResult: [{ type: Input, args: ['mat-dialog-close',] }],
        _matDialogClose: [{ type: Input, args: ['matDialogClose',] }]
    };
    return MatDialogClose;
}());
export { MatDialogClose };
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
var MatDialogTitle = /** @class */ (function () {
    function MatDialogTitle(_dialogRef, _elementRef, _dialog) {
        this._dialogRef = _dialogRef;
        this._elementRef = _elementRef;
        this._dialog = _dialog;
        this.id = "mat-dialog-title-" + dialogElementUid++;
    }
    MatDialogTitle.prototype.ngOnInit = function () {
        var _this = this;
        if (!this._dialogRef) {
            this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
        if (this._dialogRef) {
            Promise.resolve().then(function () {
                var container = _this._dialogRef._containerInstance;
                if (container && !container._ariaLabelledBy) {
                    container._ariaLabelledBy = _this.id;
                }
            });
        }
    };
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
    MatDialogTitle.ctorParameters = function () { return [
        { type: MatDialogRef, decorators: [{ type: Optional }] },
        { type: ElementRef },
        { type: MatDialog }
    ]; };
    MatDialogTitle.propDecorators = {
        id: [{ type: Input }]
    };
    return MatDialogTitle;
}());
export { MatDialogTitle };
/**
 * Scrollable content container of a dialog.
 */
var MatDialogContent = /** @class */ (function () {
    function MatDialogContent() {
    }
    MatDialogContent.decorators = [
        { type: Directive, args: [{
                    selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]",
                    host: { 'class': 'mat-dialog-content' }
                },] }
    ];
    return MatDialogContent;
}());
export { MatDialogContent };
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
var MatDialogActions = /** @class */ (function () {
    function MatDialogActions() {
    }
    MatDialogActions.decorators = [
        { type: Directive, args: [{
                    selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]",
                    host: { 'class': 'mat-dialog-actions' }
                },] }
    ];
    return MatDialogActions;
}());
export { MatDialogActions };
/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element, openDialogs) {
    var parent = element.nativeElement.parentElement;
    while (parent && !parent.classList.contains('mat-dialog-container')) {
        parent = parent.parentElement;
    }
    return parent ? openDialogs.find(function (dialog) { return dialog.id === parent.id; }) : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBRVIsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxQywrREFBK0Q7QUFDL0QsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFFekI7O0dBRUc7QUFDSDtJQXFCRSx3QkFDcUIsU0FBNEIsRUFDdkMsV0FBb0MsRUFDcEMsT0FBa0I7UUFGUCxjQUFTLEdBQVQsU0FBUyxDQUFtQjtRQUN2QyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQVg1QiwrREFBK0Q7UUFDdEQsU0FBSSxHQUFrQyxRQUFRLENBQUM7SUFVekIsQ0FBQztJQUVoQyxpQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsaUZBQWlGO1lBQ2pGLGdGQUFnRjtZQUNoRixnRkFBZ0Y7WUFDaEYsb0ZBQW9GO1lBQ3BGLG1DQUFtQztZQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUUsQ0FBQztTQUNoRjtJQUNILENBQUM7SUFFRCxvQ0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksT0FBTyxDQUFDLHVC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c0IsQ0FBQyxFQUFFO1FBQ25FLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0tBQy9CO0lBRUQsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxLQUFLLE1BQU8sQ0FBQyxFQUFFLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0RGlhbG9nfSBmcm9tICcuL2RpYWxvZyc7XG5pbXBvcnQge01hdERpYWxvZ1JlZn0gZnJvbSAnLi9kaWFsb2ctcmVmJztcblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBkaWFsb2cgZWxlbWVudHMuICovXG5sZXQgZGlhbG9nRWxlbWVudFVpZCA9IDA7XG5cbi8qKlxuICogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgY3VycmVudCBkaWFsb2cuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLWNsb3NlXSwgW21hdERpYWxvZ0Nsb3NlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nQ2xvc2UnLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnZGlhbG9nUmVmLmNsb3NlKGRpYWxvZ1Jlc3VsdCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwgfHwgbnVsbCcsXG4gICAgJ1thdHRyLnR5cGVdJzogJ3R5cGUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0Nsb3NlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAvKiogU2NyZWVucmVhZGVyIGxhYmVsIGZvciB0aGUgYnV0dG9uLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogRGVmYXVsdCB0byBcImJ1dHRvblwiIHRvIHByZXZlbnRzIGFjY2lkZW50YWwgZm9ybSBzdWJtaXRzLiAqL1xuICBASW5wdXQoKSB0eXBlOiAnc3VibWl0JyB8ICdidXR0b24nIHwgJ3Jlc2V0JyA9ICdidXR0b24nO1xuXG4gIC8qKiBEaWFsb2cgY2xvc2UgaW5wdXQuICovXG4gIEBJbnB1dCgnbWF0LWRpYWxvZy1jbG9zZScpIGRpYWxvZ1Jlc3VsdDogYW55O1xuXG4gIEBJbnB1dCgnbWF0RGlhbG9nQ2xvc2UnKSBfbWF0RGlhbG9nQ2xvc2U6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8YW55PixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9kaWFsb2c6IE1hdERpYWxvZykge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuZGlhbG9nUmVmKSB7XG4gICAgICAvLyBXaGVuIHRoaXMgZGlyZWN0aXZlIGlzIGluY2x1ZGVkIGluIGEgZGlhbG9nIHZpYSBUZW1wbGF0ZVJlZiAocmF0aGVyIHRoYW4gYmVpbmdcbiAgICAgIC8vIGluIGEgQ29tcG9uZW50KSwgdGhlIERpYWxvZ1JlZiBpc24ndCBhdmFpbGFibGUgdmlhIGluamVjdGlvbiBiZWNhdXNlIGVtYmVkZGVkXG4gICAgICAvLyB2aWV3cyBjYW5ub3QgYmUgZ2l2ZW4gYSBjdXN0b20gaW5qZWN0b3IuIEluc3RlYWQsIHdlIGxvb2sgdXAgdGhlIERpYWxvZ1JlZiBieVxuICAgICAgLy8gSUQuIFRoaXMgbXVzdCBvY2N1ciBpbiBgb25Jbml0YCwgYXMgdGhlIElEIGJpbmRpbmcgZm9yIHRoZSBkaWFsb2cgY29udGFpbmVyIHdvbid0XG4gICAgICAvLyBiZSByZXNvbHZlZCBhdCBjb25zdHJ1Y3RvciB0aW1lLlxuICAgICAgdGhpcy5kaWFsb2dSZWYgPSBnZXRDbG9zZXN0RGlhbG9nKHRoaXMuX2VsZW1lbnRSZWYsIHRoaXMuX2RpYWxvZy5vcGVuRGlhbG9ncykhO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBwcm94aWVkQ2hhbmdlID0gY2hhbmdlc1snX21hdERpYWxvZ0Nsb3NlJ10gfHwgY2hhbmdlc1snX21hdERpYWxvZ0Nsb3NlUmVzdWx0J107XG5cbiAgICBpZiAocHJveGllZENoYW5nZSkge1xuICAgICAgdGhpcy5kaWFsb2dSZXN1bHQgPSBwcm94aWVkQ2hhbmdlLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaXRsZSBvZiBhIGRpYWxvZyBlbGVtZW50LiBTdGF5cyBmaXhlZCB0byB0aGUgdG9wIG9mIHRoZSBkaWFsb2cgd2hlbiBzY3JvbGxpbmcuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLXRpdGxlXSwgW21hdERpYWxvZ1RpdGxlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nVGl0bGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kaWFsb2ctdGl0bGUnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nVGl0bGUgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1kaWFsb2ctdGl0bGUtJHtkaWFsb2dFbGVtZW50VWlkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYgPSBnZXRDbG9zZXN0RGlhbG9nKHRoaXMuX2VsZW1lbnRSZWYsIHRoaXMuX2RpYWxvZy5vcGVuRGlhbG9ncykhO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9kaWFsb2dSZWYuX2NvbnRhaW5lckluc3RhbmNlO1xuXG4gICAgICAgIGlmIChjb250YWluZXIgJiYgIWNvbnRhaW5lci5fYXJpYUxhYmVsbGVkQnkpIHtcbiAgICAgICAgICBjb250YWluZXIuX2FyaWFMYWJlbGxlZEJ5ID0gdGhpcy5pZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBTY3JvbGxhYmxlIGNvbnRlbnQgY29udGFpbmVyIG9mIGEgZGlhbG9nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LWRpYWxvZy1jb250ZW50XSwgbWF0LWRpYWxvZy1jb250ZW50LCBbbWF0RGlhbG9nQ29udGVudF1gLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1kaWFsb2ctY29udGVudCd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbnRlbnQge31cblxuXG4vKipcbiAqIENvbnRhaW5lciBmb3IgdGhlIGJvdHRvbSBhY3Rpb24gYnV0dG9ucyBpbiBhIGRpYWxvZy5cbiAqIFN0YXlzIGZpeGVkIHRvIHRoZSBib3R0b20gd2hlbiBzY3JvbGxpbmcuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFttYXQtZGlhbG9nLWFjdGlvbnNdLCBtYXQtZGlhbG9nLWFjdGlvbnMsIFttYXREaWFsb2dBY3Rpb25zXWAsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWRpYWxvZy1hY3Rpb25zJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQWN0aW9ucyB7fVxuXG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgTWF0RGlhbG9nUmVmIHRvIGFuIGVsZW1lbnQgYnkgbG9va2luZyBhdCB0aGUgRE9NLlxuICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCByZWxhdGl2ZSB0byB3aGljaCB0byBsb29rIGZvciBhIGRpYWxvZy5cbiAqIEBwYXJhbSBvcGVuRGlhbG9ncyBSZWZlcmVuY2VzIHRvIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICovXG5mdW5jdGlvbiBnZXRDbG9zZXN0RGlhbG9nKGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBvcGVuRGlhbG9nczogTWF0RGlhbG9nUmVmPGFueT5bXSkge1xuICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtZGlhbG9nLWNvbnRhaW5lcicpKSB7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gcGFyZW50ID8gb3BlbkRpYWxvZ3MuZmluZChkaWFsb2cgPT4gZGlhbG9nLmlkID09PSBwYXJlbnQhLmlkKSA6IG51bGw7XG59XG4iXX0=