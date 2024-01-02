/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Input, Optional, } from '@angular/core';
import { MatDialog } from './dialog';
import { _closeDialogVia, MatDialogRef } from './dialog-ref';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogClose, deps: [{ token: i1.MatDialogRef, optional: true }, { token: i0.ElementRef }, { token: i2.MatDialog }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatDialogClose, isStandalone: true, selector: "[mat-dialog-close], [matDialogClose]", inputs: { ariaLabel: ["aria-label", "ariaLabel"], type: "type", dialogResult: ["mat-dialog-close", "dialogResult"], _matDialogClose: ["matDialogClose", "_matDialogClose"] }, host: { listeners: { "click": "_onButtonClick($event)" }, properties: { "attr.aria-label": "ariaLabel || null", "attr.type": "type" } }, exportAs: ["matDialogClose"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogClose, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-dialog-close], [matDialogClose]',
                    exportAs: 'matDialogClose',
                    standalone: true,
                    host: {
                        '(click)': '_onButtonClick($event)',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.type]': 'type',
                    },
                }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i2.MatDialog }], propDecorators: { ariaLabel: [{
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
        this.id = `mat-mdc-dialog-title-${dialogElementUid++}`;
    }
    ngOnInit() {
        if (!this._dialogRef) {
            this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
        if (this._dialogRef) {
            Promise.resolve().then(() => {
                // Note: we null check the queue, because there are some internal
                // tests that are mocking out `MatDialogRef` incorrectly.
                this._dialogRef._containerInstance?._ariaLabelledByQueue?.push(this.id);
            });
        }
    }
    ngOnDestroy() {
        // Note: we null check the queue, because there are some internal
        // tests that are mocking out `MatDialogRef` incorrectly.
        const queue = this._dialogRef?._containerInstance?._ariaLabelledByQueue;
        if (queue) {
            Promise.resolve().then(() => {
                const index = queue.indexOf(this.id);
                if (index > -1) {
                    queue.splice(index, 1);
                }
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogTitle, deps: [{ token: i1.MatDialogRef, optional: true }, { token: i0.ElementRef }, { token: i2.MatDialog }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatDialogTitle, isStandalone: true, selector: "[mat-dialog-title], [matDialogTitle]", inputs: { id: "id" }, host: { properties: { "id": "id" }, classAttribute: "mat-mdc-dialog-title mdc-dialog__title" }, exportAs: ["matDialogTitle"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-dialog-title], [matDialogTitle]',
                    exportAs: 'matDialogTitle',
                    standalone: true,
                    host: {
                        'class': 'mat-mdc-dialog-title mdc-dialog__title',
                        '[id]': 'id',
                    },
                }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i2.MatDialog }], propDecorators: { id: [{
                type: Input
            }] } });
/**
 * Scrollable content container of a dialog.
 */
export class MatDialogContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogContent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatDialogContent, isStandalone: true, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]", host: { classAttribute: "mat-mdc-dialog-content mdc-dialog__content" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogContent, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
                    host: { 'class': 'mat-mdc-dialog-content mdc-dialog__content' },
                    standalone: true,
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogActions, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatDialogActions, isStandalone: true, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: { align: "align" }, host: { properties: { "class.mat-mdc-dialog-actions-align-center": "align === \"center\"", "class.mat-mdc-dialog-actions-align-end": "align === \"end\"" }, classAttribute: "mat-mdc-dialog-actions mdc-dialog__actions" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatDialogActions, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
                    standalone: true,
                    host: {
                        'class': 'mat-mdc-dialog-actions mdc-dialog__actions',
                        '[class.mat-mdc-dialog-actions-align-center]': 'align === "center"',
                        '[class.mat-mdc-dialog-actions-align-end]': 'align === "end"',
                    },
                }]
        }], propDecorators: { align: [{
                type: Input
            }] } });
/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element, openDialogs) {
    let parent = element.nativeElement.parentElement;
    while (parent && !parent.classList.contains('mat-mdc-dialog-container')) {
        parent = parent.parentElement;
    }
    return parent ? openDialogs.find(dialog => dialog.id === parent.id) : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBSUwsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7QUFFM0QsK0RBQStEO0FBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCOztHQUVHO0FBV0gsTUFBTSxPQUFPLGNBQWM7SUFZekI7SUFDRSxrRkFBa0Y7SUFDbEYsK0NBQStDO0lBQzVCLFNBQTRCLEVBQ3ZDLFdBQW9DLEVBQ3BDLE9BQWtCO1FBRlAsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUFDdkMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVc7UUFiNUIsK0RBQStEO1FBQ3RELFNBQUksR0FBa0MsUUFBUSxDQUFDO0lBYXJELENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwQixpRkFBaUY7WUFDakYsZ0ZBQWdGO1lBQ2hGLGdGQUFnRjtZQUNoRixvRkFBb0Y7WUFDcEYsbUNBQW1DO1lBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBRSxDQUFDO1FBQ2pGLENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLE1BQU0sYUFBYSxHQUFHLE9B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eEUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDaEMsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtNYXREaWFsb2d9IGZyb20gJy4vZGlhbG9nJztcbmltcG9ydCB7X2Nsb3NlRGlhbG9nVmlhLCBNYXREaWFsb2dSZWZ9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5cbi8qKiBDb3VudGVyIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgZGlhbG9nIGVsZW1lbnRzLiAqL1xubGV0IGRpYWxvZ0VsZW1lbnRVaWQgPSAwO1xuXG4vKipcbiAqIEJ1dHRvbiB0aGF0IHdpbGwgY2xvc2UgdGhlIGN1cnJlbnQgZGlhbG9nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWRpYWxvZy1jbG9zZV0sIFttYXREaWFsb2dDbG9zZV0nLFxuICBleHBvcnRBczogJ21hdERpYWxvZ0Nsb3NlJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ19vbkJ1dHRvbkNsaWNrKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwgfHwgbnVsbCcsXG4gICAgJ1thdHRyLnR5cGVdJzogJ3R5cGUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDbG9zZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgLyoqIFNjcmVlbi1yZWFkZXIgbGFiZWwgZm9yIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBEZWZhdWx0IHRvIFwiYnV0dG9uXCIgdG8gcHJldmVudHMgYWNjaWRlbnRhbCBmb3JtIHN1Ym1pdHMuICovXG4gIEBJbnB1dCgpIHR5cGU6ICdzdWJtaXQnIHwgJ2J1dHRvbicgfCAncmVzZXQnID0gJ2J1dHRvbic7XG5cbiAgLyoqIERpYWxvZyBjbG9zZSBpbnB1dC4gKi9cbiAgQElucHV0KCdtYXQtZGlhbG9nLWNsb3NlJykgZGlhbG9nUmVzdWx0OiBhbnk7XG5cbiAgQElucHV0KCdtYXREaWFsb2dDbG9zZScpIF9tYXREaWFsb2dDbG9zZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8vIFRoZSBkaWFsb2cgdGl0bGUgZGlyZWN0aXZlIGlzIGFsd2F5cyB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggYSBgTWF0RGlhbG9nUmVmYC5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGxpZ2h0d2VpZ2h0LXRva2Vuc1xuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmRpYWxvZ1JlZikge1xuICAgICAgLy8gV2hlbiB0aGlzIGRpcmVjdGl2ZSBpcyBpbmNsdWRlZCBpbiBhIGRpYWxvZyB2aWEgVGVtcGxhdGVSZWYgKHJhdGhlciB0aGFuIGJlaW5nXG4gICAgICAvLyBpbiBhIENvbXBvbmVudCksIHRoZSBEaWFsb2dSZWYgaXNuJ3QgYXZhaWxhYmxlIHZpYSBpbmplY3Rpb24gYmVjYXVzZSBlbWJlZGRlZFxuICAgICAgLy8gdmlld3MgY2Fubm90IGJlIGdpdmVuIGEgY3VzdG9tIGluamVjdG9yLiBJbnN0ZWFkLCB3ZSBsb29rIHVwIHRoZSBEaWFsb2dSZWYgYnlcbiAgICAgIC8vIElELiBUaGlzIG11c3Qgb2NjdXIgaW4gYG9uSW5pdGAsIGFzIHRoZSBJRCBiaW5kaW5nIGZvciB0aGUgZGlhbG9nIGNvbnRhaW5lciB3b24ndFxuICAgICAgLy8gYmUgcmVzb2x2ZWQgYXQgY29uc3RydWN0b3IgdGltZS5cbiAgICAgIHRoaXMuZGlhbG9nUmVmID0gZ2V0Q2xvc2VzdERpYWxvZyh0aGlzLl9lbGVtZW50UmVmLCB0aGlzLl9kaWFsb2cub3BlbkRpYWxvZ3MpITtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcHJveGllZENoYW5nZSA9IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZSddIHx8IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZVJlc3VsdCddO1xuXG4gICAgaWYgKHByb3hpZWRDaGFuZ2UpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVzdWx0ID0gcHJveGllZENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgX29uQnV0dG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBEZXRlcm1pbmF0ZSB0aGUgZm9jdXMgb3JpZ2luIHVzaW5nIHRoZSBjbGljayBldmVudCwgYmVjYXVzZSB1c2luZyB0aGUgRm9jdXNNb25pdG9yIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gaW5jb3JyZWN0IG9yaWdpbnMuIE1vc3Qgb2YgdGhlIHRpbWUsIGNsb3NlIGJ1dHRvbnMgd2lsbCBiZSBhdXRvIGZvY3VzZWQgaW4gdGhlXG4gICAgLy8gZGlhbG9nLCBhbmQgdGhlcmVmb3JlIGNsaWNraW5nIHRoZSBidXR0b24gd29uJ3QgcmVzdWx0IGluIGEgZm9jdXMgY2hhbmdlLiBUaGlzIG1lYW5zIHRoYXRcbiAgICAvLyB0aGUgRm9jdXNNb25pdG9yIHdvbid0IGRldGVjdCBhbnkgb3JpZ2luIGNoYW5nZSwgYW5kIHdpbGwgYWx3YXlzIG91dHB1dCBgcHJvZ3JhbWAuXG4gICAgX2Nsb3NlRGlhbG9nVmlhKFxuICAgICAgdGhpcy5kaWFsb2dSZWYsXG4gICAgICBldmVudC5zY3JlZW5YID09PSAwICYmIGV2ZW50LnNjcmVlblkgPT09IDAgPyAna2V5Ym9hcmQnIDogJ21vdXNlJyxcbiAgICAgIHRoaXMuZGlhbG9nUmVzdWx0LFxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaXRsZSBvZiBhIGRpYWxvZyBlbGVtZW50LiBTdGF5cyBmaXhlZCB0byB0aGUgdG9wIG9mIHRoZSBkaWFsb2cgd2hlbiBzY3JvbGxpbmcuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtZGlhbG9nLXRpdGxlXSwgW21hdERpYWxvZ1RpdGxlXScsXG4gIGV4cG9ydEFzOiAnbWF0RGlhbG9nVGl0bGUnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtZGlhbG9nLXRpdGxlIG1kYy1kaWFsb2dfX3RpdGxlJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ1RpdGxlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1tZGMtZGlhbG9nLXRpdGxlLSR7ZGlhbG9nRWxlbWVudFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLy8gVGhlIGRpYWxvZyB0aXRsZSBkaXJlY3RpdmUgaXMgYWx3YXlzIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBhIGBNYXREaWFsb2dSZWZgLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbGlnaHR3ZWlnaHQtdG9rZW5zXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8YW55PixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9kaWFsb2c6IE1hdERpYWxvZyxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYgPSBnZXRDbG9zZXN0RGlhbG9nKHRoaXMuX2VsZW1lbnRSZWYsIHRoaXMuX2RpYWxvZy5vcGVuRGlhbG9ncykhO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBOb3RlOiB3ZSBudWxsIGNoZWNrIHRoZSBxdWV1ZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZSBpbnRlcm5hbFxuICAgICAgICAvLyB0ZXN0cyB0aGF0IGFyZSBtb2NraW5nIG91dCBgTWF0RGlhbG9nUmVmYCBpbmNvcnJlY3RseS5cbiAgICAgICAgdGhpcy5fZGlhbG9nUmVmLl9jb250YWluZXJJbnN0YW5jZT8uX2FyaWFMYWJlbGxlZEJ5UXVldWU/LnB1c2godGhpcy5pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBOb3RlOiB3ZSBudWxsIGNoZWNrIHRoZSBxdWV1ZSwgYmVjYXVzZSB0aGVyZSBhcmUgc29tZSBpbnRlcm5hbFxuICAgIC8vIHRlc3RzIHRoYXQgYXJlIG1vY2tpbmcgb3V0IGBNYXREaWFsb2dSZWZgIGluY29ycmVjdGx5LlxuICAgIGNvbnN0IHF1ZXVlID0gdGhpcy5fZGlhbG9nUmVmPy5fY29udGFpbmVySW5zdGFuY2U/Ll9hcmlhTGFiZWxsZWRCeVF1ZXVlO1xuXG4gICAgaWYgKHF1ZXVlKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBxdWV1ZS5pbmRleE9mKHRoaXMuaWQpO1xuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgcXVldWUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2Nyb2xsYWJsZSBjb250ZW50IGNvbnRhaW5lciBvZiBhIGRpYWxvZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1kaWFsb2ctY29udGVudF0sIG1hdC1kaWFsb2ctY29udGVudCwgW21hdERpYWxvZ0NvbnRlbnRdYCxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtbWRjLWRpYWxvZy1jb250ZW50IG1kYy1kaWFsb2dfX2NvbnRlbnQnfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29udGVudCB7fVxuXG4vKipcbiAqIENvbnRhaW5lciBmb3IgdGhlIGJvdHRvbSBhY3Rpb24gYnV0dG9ucyBpbiBhIGRpYWxvZy5cbiAqIFN0YXlzIGZpeGVkIHRvIHRoZSBib3R0b20gd2hlbiBzY3JvbGxpbmcuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFttYXQtZGlhbG9nLWFjdGlvbnNdLCBtYXQtZGlhbG9nLWFjdGlvbnMsIFttYXREaWFsb2dBY3Rpb25zXWAsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1kaWFsb2ctYWN0aW9ucyBtZGMtZGlhbG9nX19hY3Rpb25zJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZGlhbG9nLWFjdGlvbnMtYWxpZ24tY2VudGVyXSc6ICdhbGlnbiA9PT0gXCJjZW50ZXJcIicsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWRpYWxvZy1hY3Rpb25zLWFsaWduLWVuZF0nOiAnYWxpZ24gPT09IFwiZW5kXCInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dBY3Rpb25zIHtcbiAgLyoqXG4gICAqIEhvcml6b250YWwgYWxpZ25tZW50IG9mIGFjdGlvbiBidXR0b25zLlxuICAgKi9cbiAgQElucHV0KCkgYWxpZ24/OiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJyA9ICdzdGFydCc7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgTWF0RGlhbG9nUmVmIHRvIGFuIGVsZW1lbnQgYnkgbG9va2luZyBhdCB0aGUgRE9NLlxuICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCByZWxhdGl2ZSB0byB3aGljaCB0byBsb29rIGZvciBhIGRpYWxvZy5cbiAqIEBwYXJhbSBvcGVuRGlhbG9ncyBSZWZlcmVuY2VzIHRvIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICovXG5mdW5jdGlvbiBnZXRDbG9zZXN0RGlhbG9nKGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBvcGVuRGlhbG9nczogTWF0RGlhbG9nUmVmPGFueT5bXSkge1xuICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtbWRjLWRpYWxvZy1jb250YWluZXInKSkge1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudCA/IG9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gcGFyZW50IS5pZCkgOiBudWxsO1xufVxuIl19