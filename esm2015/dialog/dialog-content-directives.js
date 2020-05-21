/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { Directive, Input, Optional, ElementRef, } from '@angular/core';
import { MatDialog } from './dialog';
import { MatDialogRef } from './dialog-ref';
/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;
/**
 * Button that will close the current dialog.
 */
let MatDialogClose = /** @class */ (() => {
    let MatDialogClose = class MatDialogClose {
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
    };
    __decorate([
        Input('aria-label'),
        __metadata("design:type", String)
    ], MatDialogClose.prototype, "ariaLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatDialogClose.prototype, "type", void 0);
    __decorate([
        Input('mat-dialog-close'),
        __metadata("design:type", Object)
    ], MatDialogClose.prototype, "dialogResult", void 0);
    __decorate([
        Input('matDialogClose'),
        __metadata("design:type", Object)
    ], MatDialogClose.prototype, "_matDialogClose", void 0);
    MatDialogClose = __decorate([
        Directive({
            selector: '[mat-dialog-close], [matDialogClose]',
            exportAs: 'matDialogClose',
            host: {
                '(click)': 'dialogRef.close(dialogResult)',
                '[attr.aria-label]': 'ariaLabel || null',
                '[attr.type]': 'type',
            }
        }),
        __param(0, Optional()),
        __metadata("design:paramtypes", [MatDialogRef,
            ElementRef,
            MatDialog])
    ], MatDialogClose);
    return MatDialogClose;
})();
export { MatDialogClose };
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
let MatDialogTitle = /** @class */ (() => {
    let MatDialogTitle = class MatDialogTitle {
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
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatDialogTitle.prototype, "id", void 0);
    MatDialogTitle = __decorate([
        Directive({
            selector: '[mat-dialog-title], [matDialogTitle]',
            exportAs: 'matDialogTitle',
            host: {
                'class': 'mat-dialog-title',
                '[id]': 'id',
            },
        }),
        __param(0, Optional()),
        __metadata("design:paramtypes", [MatDialogRef,
            ElementRef,
            MatDialog])
    ], MatDialogTitle);
    return MatDialogTitle;
})();
export { MatDialogTitle };
/**
 * Scrollable content container of a dialog.
 */
let MatDialogContent = /** @class */ (() => {
    let MatDialogContent = class MatDialogContent {
    };
    MatDialogContent = __decorate([
        Directive({
            selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
            host: { 'class': 'mat-dialog-content' }
        })
    ], MatDialogContent);
    return MatDialogContent;
})();
export { MatDialogContent };
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
let MatDialogActions = /** @class */ (() => {
    let MatDialogActions = class MatDialogActions {
    };
    MatDialogActions = __decorate([
        Directive({
            selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
            host: { 'class': 'mat-dialog-actions' }
        })
    ], MatDialogActions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRlbnQtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBR0wsUUFBUSxFQUVSLFVBQVUsR0FDWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFMUMsK0RBQStEO0FBQy9ELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCOztHQUVHO0FBVUg7SUFBQSxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO1FBWXpCLFlBQ3FCLFNBQTRCLEVBQ3ZDLFdBQW9DLEVBQ3BDLE9BQWtCO1lBRlAsY0FBUyxHQUFULFNBQVMsQ0FBbUI7WUFDdkMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1lBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVc7WUFYNUIsK0RBQStEO1lBQ3RELFNBQUksR0FBa0MsUUFBUSxDQUFDO1FBVXpCLENBQUM7UUFFaEMsUUFBUTtZQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixpRkFBaUY7Z0JBQ2pGLGdGQUFnRjtnQkFDaEYsZ0ZBQWdGO2dCQUNoRixvRkFBb0Y7Z0JBQ3BGLG1DQUFtQztnQkFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFFLENBQUM7YUFDaEY7UUFDSCxDQUFDO1FBRUQsV0FBVyxDQUFDLE9BQXNCO1lBQ2hDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRXJGLElBQUksYUFBYSxFQUFFO2dCQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUM7YUFDaEQ7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtJQWpDc0I7UUFBcEIsS0FBSyxDQUFDLFlBQVksQ0FBQzs7cURBQW1CO0lBRzlCO1FBQVIsS0FBSyxFQUFFOztnREFBZ0Q7SUFHN0I7UUFBMUIsS0FBSyxDQUFDLGtCQUFrQixDQUFDOzt3REFBbUI7SUFFcEI7UUFBeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDOzsyREFBc0I7SUFWbkMsY0FBYztRQVQxQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0NBQXNDO1lBQ2hELFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsSUFBSSxFQUFFO2dCQUNKLFNBQVMsRUFBRSwrQkFBK0I7Z0JBQzFDLG1CQUFtQixFQUFFLG1CQUFtQjtnQkFDeEMsYUFBYSxFQUFFLE1BQU07YUFDdEI7U0FDRixDQUFDO1FBY0csV0FBQSxRQUFRLEVBQUUsQ0FBQTt5Q0FBbUIsWUFBWTtZQUNyQixVQUFVO1lBQ2QsU0FBUztPQWZqQixjQUFjLENBbUMxQjtJQUFELHFCQUFDO0tBQUE7U0FuQ1ksY0FBYztBQXFDM0I7O0dBRUc7QUFTSDtJQUFBLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWM7UUFHekIsWUFDc0IsVUFBNkIsRUFDekMsV0FBb0MsRUFDcEMsT0FBa0I7WUFGTixlQUFVLEdBQVYsVUFBVSxDQUFtQjtZQUN6QyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7WUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBVztZQUxuQixPQUFFLEdBQVcsb0JBQW9CLGdCQUFnQixFQUFFLEVBQUUsQ0FBQztRQUtoQyxDQUFDO1FBRWhDLFFBQVE7WUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFFLENBQUM7YUFDakY7WUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO29CQUVyRCxJQUFJLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUU7d0JBQzNDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztxQkFDckM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUM7S0FDRixDQUFBO0lBdEJVO1FBQVIsS0FBSyxFQUFFOzs4Q0FBdUQ7SUFEcEQsY0FBYztRQVIxQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0NBQXNDO1lBQ2hELFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxrQkFBa0I7Z0JBQzNCLE1BQU0sRUFBRSxJQUFJO2FBQ2I7U0FDRixDQUFDO1FBS0csV0FBQSxRQUFRLEVBQUUsQ0FBQTt5Q0FBcUIsWUFBWTtZQUN2QixVQUFVO1lBQ2QsU0FBUztPQU5qQixjQUFjLENBdUIxQjtJQUFELHFCQUFDO0tBQUE7U0F2QlksY0FBYztBQTBCM0I7O0dBRUc7QUFLSDtJQUFBLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWdCO0tBQUcsQ0FBQTtJQUFuQixnQkFBZ0I7UUFKNUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDhEQUE4RDtZQUN4RSxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUM7U0FDdEMsQ0FBQztPQUNXLGdCQUFnQixDQUFHO0lBQUQsdUJBQUM7S0FBQTtTQUFuQixnQkFBZ0I7QUFHN0I7OztHQUdHO0FBS0g7SUFBQSxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtLQUFHLENBQUE7SUFBbkIsZ0JBQWdCO1FBSjVCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSw4REFBOEQ7WUFDeEUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFDO1NBQ3RDLENBQUM7T0FDVyxnQkFBZ0IsQ0FBRztJQUFELHVCQUFDO0tBQUE7U0FBbkIsZ0JBQWdCO0FBRzdCOzs7O0dBSUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLE9BQWdDLEVBQUUsV0FBZ0M7SUFDMUYsSUFBSSxNQUFNLEdBQXVCLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBRXJFLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTtRQUNuRSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxNQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ30gZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHtNYXREaWFsb2dSZWZ9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5cbi8qKiBDb3VudGVyIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgZGlhbG9nIGVsZW1lbnRzLiAqL1xubGV0IGRpYWxvZ0VsZW1lbnRVaWQgPSAwO1xuXG4vKipcbiAqIEJ1dHRvbiB0aGF0IHdpbGwgY2xvc2UgdGhlIGN1cnJlbnQgZGlhbG9nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWRpYWxvZy1jbG9zZV0sIFttYXREaWFsb2dDbG9zZV0nLFxuICBleHBvcnRBczogJ21hdERpYWxvZ0Nsb3NlJyxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ2RpYWxvZ1JlZi5jbG9zZShkaWFsb2dSZXN1bHQpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnYXJpYUxhYmVsIHx8IG51bGwnLFxuICAgICdbYXR0ci50eXBlXSc6ICd0eXBlJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDbG9zZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgLyoqIFNjcmVlbnJlYWRlciBsYWJlbCBmb3IgdGhlIGJ1dHRvbi4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIERlZmF1bHQgdG8gXCJidXR0b25cIiB0byBwcmV2ZW50cyBhY2NpZGVudGFsIGZvcm0gc3VibWl0cy4gKi9cbiAgQElucHV0KCkgdHlwZTogJ3N1Ym1pdCcgfCAnYnV0dG9uJyB8ICdyZXNldCcgPSAnYnV0dG9uJztcblxuICAvKiogRGlhbG9nIGNsb3NlIGlucHV0LiAqL1xuICBASW5wdXQoJ21hdC1kaWFsb2ctY2xvc2UnKSBkaWFsb2dSZXN1bHQ6IGFueTtcblxuICBASW5wdXQoJ21hdERpYWxvZ0Nsb3NlJykgX21hdERpYWxvZ0Nsb3NlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2cpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmRpYWxvZ1JlZikge1xuICAgICAgLy8gV2hlbiB0aGlzIGRpcmVjdGl2ZSBpcyBpbmNsdWRlZCBpbiBhIGRpYWxvZyB2aWEgVGVtcGxhdGVSZWYgKHJhdGhlciB0aGFuIGJlaW5nXG4gICAgICAvLyBpbiBhIENvbXBvbmVudCksIHRoZSBEaWFsb2dSZWYgaXNuJ3QgYXZhaWxhYmxlIHZpYSBpbmplY3Rpb24gYmVjYXVzZSBlbWJlZGRlZFxuICAgICAgLy8gdmlld3MgY2Fubm90IGJlIGdpdmVuIGEgY3VzdG9tIGluamVjdG9yLiBJbnN0ZWFkLCB3ZSBsb29rIHVwIHRoZSBEaWFsb2dSZWYgYnlcbiAgICAgIC8vIElELiBUaGlzIG11c3Qgb2NjdXIgaW4gYG9uSW5pdGAsIGFzIHRoZSBJRCBiaW5kaW5nIGZvciB0aGUgZGlhbG9nIGNvbnRhaW5lciB3b24ndFxuICAgICAgLy8gYmUgcmVzb2x2ZWQgYXQgY29uc3RydWN0b3IgdGltZS5cbiAgICAgIHRoaXMuZGlhbG9nUmVmID0gZ2V0Q2xvc2VzdERpYWxvZyh0aGlzLl9lbGVtZW50UmVmLCB0aGlzLl9kaWFsb2cub3BlbkRpYWxvZ3MpITtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcHJveGllZENoYW5nZSA9IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZSddIHx8IGNoYW5nZXNbJ19tYXREaWFsb2dDbG9zZVJlc3VsdCddO1xuXG4gICAgaWYgKHByb3hpZWRDaGFuZ2UpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVzdWx0ID0gcHJveGllZENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGl0bGUgb2YgYSBkaWFsb2cgZWxlbWVudC4gU3RheXMgZml4ZWQgdG8gdGhlIHRvcCBvZiB0aGUgZGlhbG9nIHdoZW4gc2Nyb2xsaW5nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWRpYWxvZy10aXRsZV0sIFttYXREaWFsb2dUaXRsZV0nLFxuICBleHBvcnRBczogJ21hdERpYWxvZ1RpdGxlJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGlhbG9nLXRpdGxlJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ1RpdGxlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtZGlhbG9nLXRpdGxlLSR7ZGlhbG9nRWxlbWVudFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8YW55PixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9kaWFsb2c6IE1hdERpYWxvZykge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgdGhpcy5fZGlhbG9nUmVmID0gZ2V0Q2xvc2VzdERpYWxvZyh0aGlzLl9lbGVtZW50UmVmLCB0aGlzLl9kaWFsb2cub3BlbkRpYWxvZ3MpITtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZGlhbG9nUmVmLl9jb250YWluZXJJbnN0YW5jZTtcblxuICAgICAgICBpZiAoY29udGFpbmVyICYmICFjb250YWluZXIuX2FyaWFMYWJlbGxlZEJ5KSB7XG4gICAgICAgICAgY29udGFpbmVyLl9hcmlhTGFiZWxsZWRCeSA9IHRoaXMuaWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogU2Nyb2xsYWJsZSBjb250ZW50IGNvbnRhaW5lciBvZiBhIGRpYWxvZy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1kaWFsb2ctY29udGVudF0sIG1hdC1kaWFsb2ctY29udGVudCwgW21hdERpYWxvZ0NvbnRlbnRdYCxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZGlhbG9nLWNvbnRlbnQnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb250ZW50IHt9XG5cblxuLyoqXG4gKiBDb250YWluZXIgZm9yIHRoZSBib3R0b20gYWN0aW9uIGJ1dHRvbnMgaW4gYSBkaWFsb2cuXG4gKiBTdGF5cyBmaXhlZCB0byB0aGUgYm90dG9tIHdoZW4gc2Nyb2xsaW5nLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LWRpYWxvZy1hY3Rpb25zXSwgbWF0LWRpYWxvZy1hY3Rpb25zLCBbbWF0RGlhbG9nQWN0aW9uc11gLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1kaWFsb2ctYWN0aW9ucyd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0FjdGlvbnMge31cblxuXG4vKipcbiAqIEZpbmRzIHRoZSBjbG9zZXN0IE1hdERpYWxvZ1JlZiB0byBhbiBlbGVtZW50IGJ5IGxvb2tpbmcgYXQgdGhlIERPTS5cbiAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgcmVsYXRpdmUgdG8gd2hpY2ggdG8gbG9vayBmb3IgYSBkaWFsb2cuXG4gKiBAcGFyYW0gb3BlbkRpYWxvZ3MgUmVmZXJlbmNlcyB0byB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2xvc2VzdERpYWxvZyhlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Piwgb3BlbkRpYWxvZ3M6IE1hdERpYWxvZ1JlZjxhbnk+W10pIHtcbiAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgd2hpbGUgKHBhcmVudCAmJiAhcGFyZW50LmNsYXNzTGlzdC5jb250YWlucygnbWF0LWRpYWxvZy1jb250YWluZXInKSkge1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudCA/IG9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gcGFyZW50IS5pZCkgOiBudWxsO1xufVxuIl19