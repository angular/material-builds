/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, Optional, ElementRef, } from '@angular/core';
import { MatDialog } from './dialog';
import { MatDialogRef, _closeDialogVia } from './dialog-ref';
import * as i0 from "@angular/core";
import * as i1 from "./dialog-ref";
import * as i2 from "./dialog";
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
MatDialogClose.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogClose, deps: [{ token: i1.MatDialogRef, optional: true }, { token: i0.ElementRef }, { token: i2.MatDialog }], target: i0.ɵɵFactoryTarget.Directive });
MatDialogClose.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: { ariaLabel: ["aria-label", "ariaLabel"], type: "type", dialogResult: ["mat-dialog-close", "dialogResult"], _matDialogClose: ["matDialogClose", "_matDialogClose"] }, host: { listeners: { "click": "_onButtonClick($event)" }, properties: { "attr.aria-label": "ariaLabel || null", "attr.type": "type" } }, exportAs: ["matDialogClose"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogClose, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-dialog-close], [matDialogClose]',
                    exportAs: 'matDialogClose',
                    host: {
                        '(click)': '_onButtonClick($event)',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.type]': 'type',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.MatDialogRef, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i2.MatDialog }]; }, propDecorators: { ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], type: [{
                type: Input
            }], dialogResult: [{
                type: Input,
                args: ['mat-dialog-close']
            }], _matDialogClose: [{
                type: Input,
                args: ['matDialogClose']
            }] } });
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
MatDialogTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogTitle, deps: [{ token: i1.MatDialogRef, optional: true }, { token: i0.ElementRef }, { token: i2.MatDialog }], target: i0.ɵɵFactoryTarget.Directive });
MatDialogTitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: { id: "id" }, host: { properties: { "id": "id" }, classAttribute: "mat-dialog-title" }, exportAs: ["matDialogTitle"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-dialog-title], [matDialogTitle]',
                    exportAs: 'matDialogTitle',
                    host: {
                        'class': 'mat-dialog-title',
                        '[id]': 'id',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.MatDialogRef, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i2.MatDialog }]; }, propDecorators: { id: [{
                type: Input
            }] } });
/**
 * Scrollable content container of a dialog.
 */
export class MatDialogContent {
}
MatDialogContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatDialogContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]", host: { classAttribute: "mat-dialog-content" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogContent, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
                    host: { 'class': 'mat-dialog-content' },
                }]
        }] });
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
export class MatDialogActions {
    constructor() {
        /**
         * Horizontal alignment of action buttons.
         */
        this.align = 'start';
    }
}
MatDialogActions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogActions, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatDialogActions.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: { align: "align" }, host: { properties: { "class.mat-dialog-actions-align-center": "align === \"center\"", "class.mat-dialog-actions-align-end": "align === \"end\"" }, classAttribute: "mat-dialog-actions" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogActions, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
                    host: {
                        'class': 'mat-dialog-actions',
                        '[class.mat-dialog-actions-align-center]': 'align === "center"',
                        '[class.mat-dialog-actions-align-end]': 'align === "end"',
                    },
                }]
        }], propDecorators: { align: [{
                type: Input
            }] } });
// TODO(crisbeto): this utility shouldn't be necessary anymore, because the dialog ref is provided
// both to component and template dialogs through DI. We need to keep it around, because there are
// some internal wrappers around `MatDialog` that happened to work by accident, because we had this
// fallback logic in place.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxRQUFRLEVBRVIsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLFlBQVksRUFBRSxlQUFlLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7QUFFM0QsK0RBQStEO0FBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCOztHQUVHO0FBVUgsTUFBTSxPQUFPLGNBQWM7SUFZekI7SUFDRTs7OztPQUlHO0lBQ0gsa0ZBQWtGO0lBQ2xGLCtDQUErQztJQUM1QixTQUE0QixFQUN2QyxXQUFvQyxFQUNwQyxPQUFrQjtRQUZQLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBQ3ZDLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFXO1FBbEI1QiwrREFBK0Q7UUFDdEQsU0FBSSxHQUFrQyxRQUFRLENBQUM7SUFrQnJELENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsaUZBQWlGO1lBQ2pGLGdGQUFnRjtZQUNoRixnRkFBZ0Y7WUFDaEYsb0ZBQW9GO1lBQ3BGLG1DQUFtQztZQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUUsQ0FBQztTQUNoRjtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFFckYsSUFBSSxhQUFhLEVBQUU7WUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFpQjtRQUM5QiwwRkFBMEY7UUFDMUYsMkZBQTJGO1FBQzNGLDRGQUE0RjtRQUM1RixxRkFBcUY7UUFDckYsZUFBZSxDQUNiLElBQUksQ0FBQyxTQUFTLEVBQ2QsS0FBSyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUNqRSxJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO0lBQ0osQ0FBQzs7MkdBdERVLGNBQWM7K0ZBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQVQxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQ0FBc0M7b0JBQ2hELFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLElBQUksRUFBRTt3QkFDSixTQUFTLEVBQUUsd0JBQXdCO3dCQUNuQyxtQkFBbUIsRUFBRSxtQkFBbUI7d0JBQ3hDLGFBQWEsRUFBRSxNQUFNO3FCQUN0QjtpQkFDRjs7MEJBcUJJLFFBQVE7NkZBbEJVLFNBQVM7c0JBQTdCLEtBQUs7dUJBQUMsWUFBWTtnQkFHVixJQUFJO3NCQUFaLEtBQUs7Z0JBR3FCLFlBQVk7c0JBQXRDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQUVBLGVBQWU7c0JBQXZDLEtBQUs7dUJBQUMsZ0JBQWdCOztBQStDekI7O0dBRUc7QUFTSCxNQUFNLE9BQU8sY0FBYztJQUl6QjtJQUNFLGtGQUFrRjtJQUNsRiwrQ0FBK0M7SUFDM0IsVUFBNkIsRUFDekMsV0FBb0MsRUFDcEMsT0FBa0I7UUFGTixlQUFVLEdBQVYsVUFBVSxDQUFtQjtRQUN6QyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQVI1QixzRkFBc0Y7UUFDN0UsT0FBRSxHQUFXLG9CQUFvQixnQkFBZ0IsRUFBRSxFQUFFLENBQUM7SUFRNUQsQ0FBQztJQUVKLFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUUsQ0FBQztTQUNqRjtRQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFFckQsSUFBSSxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFO29CQUMzQyxTQUFTLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7aUJBQ3JDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7OzJHQTFCVSxjQUFjOytGQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFSMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0NBQXNDO29CQUNoRCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGtCQUFrQjt3QkFDM0IsTUFBTSxFQUFFLElBQUk7cUJBQ2I7aUJBQ0Y7OzBCQVFJLFFBQVE7NkZBTEYsRUFBRTtzQkFBVixLQUFLOztBQTJCUjs7R0FFRztBQUtILE1BQU0sT0FBTyxnQkFBZ0I7OzZHQUFoQixnQkFBZ0I7aUdBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUo1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw4REFBOEQ7b0JBQ3hFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBQztpQkFDdEM7O0FBR0Q7OztHQUdHO0FBU0gsTUFBTSxPQUFPLGdCQUFnQjtJQVI3QjtRQVNFOztXQUVHO1FBQ00sVUFBSyxHQUFnQyxPQUFPLENBQUM7S0FDdkQ7OzZHQUxZLGdCQUFnQjtpR0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBUjVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDhEQUE4RDtvQkFDeEUsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxvQkFBb0I7d0JBQzdCLHlDQUF5QyxFQUFFLG9CQUFvQjt3QkFDL0Qsc0NBQXNDLEVBQUUsaUJBQWlCO3FCQUMxRDtpQkFDRjs4QkFLVSxLQUFLO3NCQUFiLEtBQUs7O0FBR1Isa0dBQWtHO0FBQ2xHLGtHQUFrRztBQUNsRyxtR0FBbUc7QUFDbkcsMkJBQTJCO0FBQzNCOzs7O0dBSUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLE9BQWdDLEVBQUUsV0FBZ0M7SUFDMUYsSUFBSSxNQUFNLEdBQXVCLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBRXJFLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTtRQUNuRSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ30gZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHtNYXREaWFsb2dSZWYsIF9jbG9zZURpYWxvZ1ZpYX0gZnJvbSAnLi9kaWFsb2ctcmVmJztcblxuLyoqIENvdW50ZXIgdXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBkaWFsb2cgZWxlbWVudHMuICovXG5sZXQgZGlhbG9nRWxlbWVudFVpZCA9IDA7XG5cbi8qKlxuICogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgY3VycmVudCBkaWFsb2cuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLWNsb3NlXSwgW21hdERpYWxvZ0Nsb3NlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nQ2xvc2UnLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnX29uQnV0dG9uQ2xpY2soJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIudHlwZV0nOiAndHlwZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0Nsb3NlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAvKiogU2NyZWVuIHJlYWRlciBsYWJlbCBmb3IgdGhlIGJ1dHRvbi4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIERlZmF1bHQgdG8gXCJidXR0b25cIiB0byBwcmV2ZW50cyBhY2NpZGVudGFsIGZvcm0gc3VibWl0cy4gKi9cbiAgQElucHV0KCkgdHlwZTogJ3N1Ym1pdCcgfCAnYnV0dG9uJyB8ICdyZXNldCcgPSAnYnV0dG9uJztcblxuICAvKiogRGlhbG9nIGNsb3NlIGlucHV0LiAqL1xuICBASW5wdXQoJ21hdC1kaWFsb2ctY2xvc2UnKSBkaWFsb2dSZXN1bHQ6IGFueTtcblxuICBASW5wdXQoJ21hdERpYWxvZ0Nsb3NlJykgX21hdERpYWxvZ0Nsb3NlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogUmVmZXJlbmNlIHRvIHRoZSBjb250YWluaW5nIGRpYWxvZy5cbiAgICAgKiBAZGVwcmVjYXRlZCBgZGlhbG9nUmVmYCBwcm9wZXJ0eSB0byBiZWNvbWUgcHJpdmF0ZS5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEzLjAuMFxuICAgICAqL1xuICAgIC8vIFRoZSBkaWFsb2cgdGl0bGUgZGlyZWN0aXZlIGlzIGFsd2F5cyB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggYSBgTWF0RGlhbG9nUmVmYC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGxpZ2h0d2VpZ2h0LXRva2Vuc1xuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmRpYWxvZ1JlZikge1xuICAgICAgLy8gV2hlbiB0aGlzIGRpcmVjdGl2ZSBpcyBpbmNsdWRlZCBpbiBhIGRpYWxvZyB2aWEgVGVtcGxhdGVSZWYgKHJhdGhlciB0aGFuIGJlaW5nXG4gICAgICAvLyBpbiBhIENvbXBvbmVudCksIHRoZSBEaWFsb2dSZWYgaXNuJ3QgYXZhaWxhYmxlIHZpYSBpbmplY3Rpb24gYmVjYXVzZSBlbWJlZGRlZFxuICAgICAgLy8gdmlld3MgY2Fubm90IGJlIGdpdmVuIGEgY3VzdG9tIGluamVjdG9yLiBJbnN0ZWFkLCB3ZSBsb29rIHVwIHRoZSBEaWFsb2dSZWYgYnlcbiAgICAgIC8vIElELiBUaGlzIG11c3Qgb2NjdXIgaW4gYG9uSW5pdGAsIGFzIHRoZSBJRCBiaW5kaW5nIGZvciB0aGUgZGlhbG9nIGNvbnRhaW5lciB3b24ndFxuICAgICAgLy8gYmUgcmVzb2x2ZWQgYXQgY29uc3RydWN0b3IgdGltZS5cbiAgICAgIHRoaXMuZGlhbG9nUmVmID0gZ2V0Q2xvc2VzdERpYWxvZyh0aGlzLl9lbGVtZW50UmVmLCB0aGlzLl9kaWFsb2cub3BlbkRpYWxvZ3MpITtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcHJveGllZENoYW5nZSA9IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZSddIHx8IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZVJlc3VsdCddO1xuXG4gICAgaWYgKHByb3hpZWRDaGFuZ2UpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVzdWx0ID0gcHJveGllZENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgX29uQnV0dG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBEZXRlcm1pbmF0ZSB0aGUgZm9jdXMgb3JpZ2luIHVzaW5nIHRoZSBjbGljayBldmVudCwgYmVjYXVzZSB1c2luZyB0aGUgRm9jdXNNb25pdG9yIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gaW5jb3JyZWN0IG9yaWdpbnMuIE1vc3Qgb2YgdGhlIHRpbWUsIGNsb3NlIGJ1dHRvbnMgd2lsbCBiZSBhdXRvIGZvY3VzZWQgaW4gdGhlXG4gICAgLy8gZGlhbG9nLCBhbmQgdGhlcmVmb3JlIGNsaWNraW5nIHRoZSBidXR0b24gd29uJ3QgcmVzdWx0IGluIGEgZm9jdXMgY2hhbmdlLiBUaGlzIG1lYW5zIHRoYXRcbiAgICAvLyB0aGUgRm9jdXNNb25pdG9yIHdvbid0IGRldGVjdCBhbnkgb3JpZ2luIGNoYW5nZSwgYW5kIHdpbGwgYWx3YXlzIG91dHB1dCBgcHJvZ3JhbWAuXG4gICAgX2Nsb3NlRGlhbG9nVmlhKFxuICAgICAgdGhpcy5kaWFsb2dSZWYsXG4gICAgICBldmVudC5zY3JlZW5YID09PSAwICYmIGV2ZW50LnNjcmVlblkgPT09IDAgPyAna2V5Ym9hcmQnIDogJ21vdXNlJyxcbiAgICAgIHRoaXMuZGlhbG9nUmVzdWx0LFxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaXRsZSBvZiBhIGRpYWxvZyBlbGVtZW50LiBTdGF5cyBmaXhlZCB0byB0aGUgdG9wIG9mIHRoZSBkaWFsb2cgd2hlbiBzY3JvbGxpbmcuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLXRpdGxlXSwgW21hdERpYWxvZ1RpdGxlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nVGl0bGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kaWFsb2ctdGl0bGUnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nVGl0bGUgaW1wbGVtZW50cyBPbkluaXQge1xuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgZGlhbG9nIHRpdGxlLiBJZiBub25lIGlzIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGF1dG8tZ2VuZXJhdGVkLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1kaWFsb2ctdGl0bGUtJHtkaWFsb2dFbGVtZW50VWlkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyBUaGUgZGlhbG9nIHRpdGxlIGRpcmVjdGl2ZSBpcyBhbHdheXMgdXNlZCBpbiBjb21iaW5hdGlvbiB3aXRoIGEgYE1hdERpYWxvZ1JlZmAuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IGdldENsb3Nlc3REaWFsb2codGhpcy5fZWxlbWVudFJlZiwgdGhpcy5fZGlhbG9nLm9wZW5EaWFsb2dzKSE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2RpYWxvZ1JlZi5fY29udGFpbmVySW5zdGFuY2U7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lciAmJiAhY29udGFpbmVyLl9hcmlhTGFiZWxsZWRCeSkge1xuICAgICAgICAgIGNvbnRhaW5lci5fYXJpYUxhYmVsbGVkQnkgPSB0aGlzLmlkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTY3JvbGxhYmxlIGNvbnRlbnQgY29udGFpbmVyIG9mIGEgZGlhbG9nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LWRpYWxvZy1jb250ZW50XSwgbWF0LWRpYWxvZy1jb250ZW50LCBbbWF0RGlhbG9nQ29udGVudF1gLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1kaWFsb2ctY29udGVudCd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb250ZW50IHt9XG5cbi8qKlxuICogQ29udGFpbmVyIGZvciB0aGUgYm90dG9tIGFjdGlvbiBidXR0b25zIGluIGEgZGlhbG9nLlxuICogU3RheXMgZml4ZWQgdG8gdGhlIGJvdHRvbSB3aGVuIHNjcm9sbGluZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1kaWFsb2ctYWN0aW9uc10sIG1hdC1kaWFsb2ctYWN0aW9ucywgW21hdERpYWxvZ0FjdGlvbnNdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGlhbG9nLWFjdGlvbnMnLFxuICAgICdbY2xhc3MubWF0LWRpYWxvZy1hY3Rpb25zLWFsaWduLWNlbnRlcl0nOiAnYWxpZ24gPT09IFwiY2VudGVyXCInLFxuICAgICdbY2xhc3MubWF0LWRpYWxvZy1hY3Rpb25zLWFsaWduLWVuZF0nOiAnYWxpZ24gPT09IFwiZW5kXCInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dBY3Rpb25zIHtcbiAgLyoqXG4gICAqIEhvcml6b250YWwgYWxpZ25tZW50IG9mIGFjdGlvbiBidXR0b25zLlxuICAgKi9cbiAgQElucHV0KCkgYWxpZ24/OiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJyA9ICdzdGFydCc7XG59XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHV0aWxpdHkgc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSBhbnltb3JlLCBiZWNhdXNlIHRoZSBkaWFsb2cgcmVmIGlzIHByb3ZpZGVkXG4vLyBib3RoIHRvIGNvbXBvbmVudCBhbmQgdGVtcGxhdGUgZGlhbG9ncyB0aHJvdWdoIERJLiBXZSBuZWVkIHRvIGtlZXAgaXQgYXJvdW5kLCBiZWNhdXNlIHRoZXJlIGFyZVxuLy8gc29tZSBpbnRlcm5hbCB3cmFwcGVycyBhcm91bmQgYE1hdERpYWxvZ2AgdGhhdCBoYXBwZW5lZCB0byB3b3JrIGJ5IGFjY2lkZW50LCBiZWNhdXNlIHdlIGhhZCB0aGlzXG4vLyBmYWxsYmFjayBsb2dpYyBpbiBwbGFjZS5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgTWF0RGlhbG9nUmVmIHRvIGFuIGVsZW1lbnQgYnkgbG9va2luZyBhdCB0aGUgRE9NLlxuICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCByZWxhdGl2ZSB0byB3aGljaCB0byBsb29rIGZvciBhIGRpYWxvZy5cbiAqIEBwYXJhbSBvcGVuRGlhbG9ncyBSZWZlcmVuY2VzIHRvIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICovXG5mdW5jdGlvbiBnZXRDbG9zZXN0RGlhbG9nKGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBvcGVuRGlhbG9nczogTWF0RGlhbG9nUmVmPGFueT5bXSkge1xuICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtZGlhbG9nLWNvbnRhaW5lcicpKSB7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gcGFyZW50ID8gb3BlbkRpYWxvZ3MuZmluZChkaWFsb2cgPT4gZGlhbG9nLmlkID09PSBwYXJlbnQhLmlkKSA6IG51bGw7XG59XG4iXX0=