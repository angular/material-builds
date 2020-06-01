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
let dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
let MatDialogClose = /** @class */ (() => {
    class MatDialogClose {
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
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
let MatDialogTitle = /** @class */ (() => {
    class MatDialogTitle {
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
/**
 * Scrollable content container of a dialog.
 */
let MatDialogContent = /** @class */ (() => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBRVIsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxQywrREFBK0Q7QUFDL0QsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFFekI7O0dBRUc7QUFDSDtJQUFBLE1BU2EsY0FBYztRQVl6QixZQUNxQixTQUE0QixFQUN2QyxXQUFvQyxFQUNwQyxPQUFrQjtZQUZQLGNBQVMsR0FBVCxTQUFTLENBQW1CO1lBQ3ZDLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtZQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFXO1lBWDVCLCtEQUErRDtZQUN0RCxTQUFJLEdBQWtDLFFBQVEsQ0FBQztRQVV6QixDQUFDO1FBRWhDLFFBQVE7WUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsaUZBQWlGO2dCQUNqRixnRkFBZ0Y7Z0JBQ2hGLGdGQUFnRjtnQkFDaEYsb0ZBQW9GO2dCQUNwRixtQ0FBbUM7Z0JBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBRSxDQUFDO2FBQ2hGO1FBQ0gsQ0FBQztRQUVELFdBQVcsQ0FBQyxPQUFzQjtZQUNoQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxPQUFPLENBQUMsdUJBQXVC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TUFBTSxDQUFDLGFBQWEsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ30gZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHtNYXREaWFsb2dSZWZ9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5cbi8qKiBDb3VudGVyIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgZGlhbG9nIGVsZW1lbnRzLiAqL1xubGV0IGRpYWxvZ0VsZW1lbnRVaWQgPSAwO1xuXG4vKipcbiAqIEJ1dHRvbiB0aGF0IHdpbGwgY2xvc2UgdGhlIGN1cnJlbnQgZGlhbG9nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWRpYWxvZy1jbG9zZV0sIFttYXREaWFsb2dDbG9zZV0nLFxuICBleHBvcnRBczogJ21hdERpYWxvZ0Nsb3NlJyxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ2RpYWxvZ1JlZi5jbG9zZShkaWFsb2dSZXN1bHQpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnYXJpYUxhYmVsIHx8IG51bGwnLFxuICAgICdbYXR0ci50eXBlXSc6ICd0eXBlJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDbG9zZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgLyoqIFNjcmVlbnJlYWRlciBsYWJlbCBmb3IgdGhlIGJ1dHRvbi4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIERlZmF1bHQgdG8gXCJidXR0b25cIiB0byBwcmV2ZW50cyBhY2NpZGVudGFsIGZvcm0gc3VibWl0cy4gKi9cbiAgQElucHV0KCkgdHlwZTogJ3N1Ym1pdCcgfCAnYnV0dG9uJyB8ICdyZXNldCcgPSAnYnV0dG9uJztcblxuICAvKiogRGlhbG9nIGNsb3NlIGlucHV0LiAqL1xuICBASW5wdXQoJ21hdC1kaWFsb2ctY2xvc2UnKSBkaWFsb2dSZXN1bHQ6IGFueTtcblxuICBASW5wdXQoJ21hdERpYWxvZ0Nsb3NlJykgX21hdERpYWxvZ0Nsb3NlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2cpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmRpYWxvZ1JlZikge1xuICAgICAgLy8gV2hlbiB0aGlzIGRpcmVjdGl2ZSBpcyBpbmNsdWRlZCBpbiBhIGRpYWxvZyB2aWEgVGVtcGxhdGVSZWYgKHJhdGhlciB0aGFuIGJlaW5nXG4gICAgICAvLyBpbiBhIENvbXBvbmVudCksIHRoZSBEaWFsb2dSZWYgaXNuJ3QgYXZhaWxhYmxlIHZpYSBpbmplY3Rpb24gYmVjYXVzZSBlbWJlZGRlZFxuICAgICAgLy8gdmlld3MgY2Fubm90IGJlIGdpdmVuIGEgY3VzdG9tIGluamVjdG9yLiBJbnN0ZWFkLCB3ZSBsb29rIHVwIHRoZSBEaWFsb2dSZWYgYnlcbiAgICAgIC8vIElELiBUaGlzIG11c3Qgb2NjdXIgaW4gYG9uSW5pdGAsIGFzIHRoZSBJRCBiaW5kaW5nIGZvciB0aGUgZGlhbG9nIGNvbnRhaW5lciB3b24ndFxuICAgICAgLy8gYmUgcmVzb2x2ZWQgYXQgY29uc3RydWN0b3IgdGltZS5cbiAgICAgIHRoaXMuZGlhbG9nUmVmID0gZ2V0Q2xvc2VzdERpYWxvZyh0aGlzLl9lbGVtZW50UmVmLCB0aGlzLl9kaWFsb2cub3BlbkRpYWxvZ3MpITtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcHJveGllZENoYW5nZSA9IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZSddIHx8IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZVJlc3VsdCddO1xuXG4gICAgaWYgKHByb3hpZWRDaGFuZ2UpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVzdWx0ID0gcHJveGllZENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGl0bGUgb2YgYSBkaWFsb2cgZWxlbWVudC4gU3RheXMgZml4ZWQgdG8gdGhlIHRvcCBvZiB0aGUgZGlhbG9nIHdoZW4gc2Nyb2xsaW5nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWRpYWxvZy10aXRsZV0sIFttYXREaWFsb2dUaXRsZV0nLFxuICBleHBvcnRBczogJ21hdERpYWxvZ1RpdGxlJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGlhbG9nLXRpdGxlJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ1RpdGxlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtZGlhbG9nLXRpdGxlLSR7ZGlhbG9nRWxlbWVudFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8YW55PixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9kaWFsb2c6IE1hdERpYWxvZykge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgdGhpcy5fZGlhbG9nUmVmID0gZ2V0Q2xvc2VzdERpYWxvZyh0aGlzLl9lbGVtZW50UmVmLCB0aGlzLl9kaWFsb2cub3BlbkRpYWxvZ3MpITtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZGlhbG9nUmVmLl9jb250YWluZXJJbnN0YW5jZTtcblxuICAgICAgICBpZiAoY29udGFpbmVyICYmICFjb250YWluZXIuX2FyaWFMYWJlbGxlZEJ5KSB7XG4gICAgICAgICAgY29udGFpbmVyLl9hcmlhTGFiZWxsZWRCeSA9IHRoaXMuaWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogU2Nyb2xsYWJsZSBjb250ZW50IGNvbnRhaW5lciBvZiBhIGRpYWxvZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1kaWFsb2ctY29udGVudF0sIG1hdC1kaWFsb2ctY29udGVudCwgW21hdERpYWxvZ0NvbnRlbnRdYCxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZGlhbG9nLWNvbnRlbnQnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb250ZW50IHt9XG5cblxuLyoqXG4gKiBDb250YWluZXIgZm9yIHRoZSBib3R0b20gYWN0aW9uIGJ1dHRvbnMgaW4gYSBkaWFsb2cuXG4gKiBTdGF5cyBmaXhlZCB0byB0aGUgYm90dG9tIHdoZW4gc2Nyb2xsaW5nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LWRpYWxvZy1hY3Rpb25zXSwgbWF0LWRpYWxvZy1hY3Rpb25zLCBbbWF0RGlhbG9nQWN0aW9uc11gLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1kaWFsb2ctYWN0aW9ucyd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0FjdGlvbnMge31cblxuXG4vKipcbiAqIEZpbmRzIHRoZSBjbG9zZXN0IE1hdERpYWxvZ1JlZiB0byBhbiBlbGVtZW50IGJ5IGxvb2tpbmcgYXQgdGhlIERPTS5cbiAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgcmVsYXRpdmUgdG8gd2hpY2ggdG8gbG9vayBmb3IgYSBkaWFsb2cuXG4gKiBAcGFyYW0gb3BlbkRpYWxvZ3MgUmVmZXJlbmNlcyB0byB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2xvc2VzdERpYWxvZyhlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Piwgb3BlbkRpYWxvZ3M6IE1hdERpYWxvZ1JlZjxhbnk+W10pIHtcbiAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgd2hpbGUgKHBhcmVudCAmJiAhcGFyZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF0LWRpYWxvZy1jb250YWluZXInKSkge1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudCA/IG9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gcGFyZW50IS5pZCkgOiBudWxsO1xufVxuIl19