/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDatepickerBase } from './datepicker-base';
/** Button that will close the datepicker and assign the current selection to the data model. */
export class MatDatepickerApply {
    constructor(_datepicker) {
        this._datepicker = _datepicker;
    }
    _applySelection() {
        this._datepicker._applyPendingSelection();
        this._datepicker.close();
    }
}
MatDatepickerApply.decorators = [
    { type: Directive, args: [{
                selector: '[matDatepickerApply], [matDateRangePickerApply]',
                host: { '(click)': '_applySelection()' }
            },] }
];
MatDatepickerApply.ctorParameters = () => [
    { type: MatDatepickerBase }
];
/** Button that will close the datepicker and discard the current selection. */
export class MatDatepickerCancel {
    constructor(_datepicker) {
        this._datepicker = _datepicker;
    }
}
MatDatepickerCancel.decorators = [
    { type: Directive, args: [{
                selector: '[matDatepickerCancel], [matDateRangePickerCancel]',
                host: { '(click)': '_datepicker.close()' }
            },] }
];
MatDatepickerCancel.ctorParameters = () => [
    { type: MatDatepickerBase }
];
/**
 * Container that can be used to project a row of action buttons
 * to the bottom of a datepicker or date range picker.
 */
export class MatDatepickerActions {
    constructor(_datepicker, _viewContainerRef) {
        this._datepicker = _datepicker;
        this._viewContainerRef = _viewContainerRef;
    }
    ngAfterViewInit() {
        this._portal = new TemplatePortal(this._template, this._viewContainerRef);
        this._datepicker.registerActions(this._portal);
    }
    ngOnDestroy() {
        var _a;
        this._datepicker.removeActions(this._portal);
        // Needs to be null checked since we initialize it in `ngAfterViewInit`.
        if (this._portal && this._portal.isAttached) {
            (_a = this._portal) === null || _a === void 0 ? void 0 : _a.detach();
        }
    }
}
MatDatepickerActions.decorators = [
    { type: Component, args: [{
                selector: 'mat-datepicker-actions, mat-date-range-picker-actions',
                template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-datepicker-actions{display:flex;justify-content:flex-end;align-items:center;padding:0 8px 8px 8px}.mat-datepicker-actions .mat-button-base+.mat-button-base{margin-left:8px}[dir=rtl] .mat-datepicker-actions .mat-button-base+.mat-button-base{margin-left:0;margin-right:8px}\n"]
            },] }
];
MatDatepickerActions.ctorParameters = () => [
    { type: MatDatepickerBase },
    { type: ViewContainerRef }
];
MatDatepickerActions.propDecorators = {
    _template: [{ type: ViewChild, args: [TemplateRef,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFNBQVMsRUFFVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxpQkFBaUIsRUFBdUIsTUFBTSxtQkFBbUIsQ0FBQztBQUcxRSxnR0FBZ0c7QUFLaEcsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixZQUFvQixXQUFzRTtRQUF0RSxnQkFBVyxHQUFYLFdBQVcsQ0FBMkQ7SUFBRyxDQUFDO0lBRTlGLGVBQWU7UUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7WUFWRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlEQUFpRDtnQkFDM0QsSUFBSSxFQUFFLEVBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFDO2FBQ3ZDOzs7WUFQTyxpQkFBaUI7O0FBa0J6QiwrRUFBK0U7QUFLL0UsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixZQUFtQixXQUFzRTtRQUF0RSxnQkFBVyxHQUFYLFdBQVcsQ0FBMkQ7SUFBRyxDQUFDOzs7WUFMOUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtREFBbUQ7Z0JBQzdELElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSxxQkFBcUIsRUFBQzthQUN6Qzs7O1lBdEJPLGlCQUFpQjs7QUE0QnpCOzs7R0FHRztBQWNILE1BQU0sT0FBTyxvQkFBb0I7SUFJL0IsWUFDVSxXQUFzRSxFQUN0RSxpQkFBbUM7UUFEbkMsZ0JBQVcsR0FBWCxXQUFXLENBQTJEO1FBQ3RFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7SUFBRyxDQUFDO0lBRWpELGVBQWU7UUFDYixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxXQUFXOztRQUNULElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3Qyx3RUFBd0U7UUFDeEUsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNDLE1BQUEsSUFBSSxDQUFDLE9BQU8sMENBQUUsTUFBTSxHQUFHO1NBQ3hCO0lBQ0gsQ0FBQzs7O1lBakNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdURBQXVEO2dCQUVqRSxRQUFRLEVBQUU7Ozs7OztHQU1UO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQTVDTyxpQkFBaUI7WUFKdkIsZ0JBQWdCOzs7d0JBa0RmLFNBQVMsU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgT25EZXN0cm95LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQmFzZSwgTWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcblxuXG4vKiogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgZGF0ZXBpY2tlciBhbmQgYXNzaWduIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgZGF0YSBtb2RlbC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXREYXRlcGlja2VyQXBwbHldLCBbbWF0RGF0ZVJhbmdlUGlja2VyQXBwbHldJyxcbiAgaG9zdDogeycoY2xpY2spJzogJ19hcHBseVNlbGVjdGlvbigpJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlckFwcGx5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlckJhc2U8TWF0RGF0ZXBpY2tlckNvbnRyb2w8dW5rbm93bj4sIHVua25vd24+KSB7fVxuXG4gIF9hcHBseVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLl9kYXRlcGlja2VyLl9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKTtcbiAgICB0aGlzLl9kYXRlcGlja2VyLmNsb3NlKCk7XG4gIH1cbn1cblxuXG4vKiogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgZGF0ZXBpY2tlciBhbmQgZGlzY2FyZCB0aGUgY3VycmVudCBzZWxlY3Rpb24uICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0RGF0ZXBpY2tlckNhbmNlbF0sIFttYXREYXRlUmFuZ2VQaWNrZXJDYW5jZWxdJyxcbiAgaG9zdDogeycoY2xpY2spJzogJ19kYXRlcGlja2VyLmNsb3NlKCknfVxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VyQ2FuY2VsIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9kYXRlcGlja2VyOiBNYXREYXRlcGlja2VyQmFzZTxNYXREYXRlcGlja2VyQ29udHJvbDx1bmtub3duPiwgdW5rbm93bj4pIHt9XG59XG5cblxuLyoqXG4gKiBDb250YWluZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBwcm9qZWN0IGEgcm93IG9mIGFjdGlvbiBidXR0b25zXG4gKiB0byB0aGUgYm90dG9tIG9mIGEgZGF0ZXBpY2tlciBvciBkYXRlIHJhbmdlIHBpY2tlci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGVwaWNrZXItYWN0aW9ucywgbWF0LWRhdGUtcmFuZ2UtcGlja2VyLWFjdGlvbnMnLFxuICBzdHlsZVVybHM6IFsnZGF0ZXBpY2tlci1hY3Rpb25zLmNzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZT5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtZGF0ZXBpY2tlci1hY3Rpb25zXCI+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJBY3Rpb25zIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgX3RlbXBsYXRlOiBUZW1wbGF0ZVJlZjx1bmtub3duPjtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRlcGlja2VyOiBNYXREYXRlcGlja2VyQmFzZTxNYXREYXRlcGlja2VyQ29udHJvbDx1bmtub3duPiwgdW5rbm93bj4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge31cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB0aGlzLl9kYXRlcGlja2VyLnJlZ2lzdGVyQWN0aW9ucyh0aGlzLl9wb3J0YWwpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGF0ZXBpY2tlci5yZW1vdmVBY3Rpb25zKHRoaXMuX3BvcnRhbCk7XG5cbiAgICAvLyBOZWVkcyB0byBiZSBudWxsIGNoZWNrZWQgc2luY2Ugd2UgaW5pdGlhbGl6ZSBpdCBpbiBgbmdBZnRlclZpZXdJbml0YC5cbiAgICBpZiAodGhpcy5fcG9ydGFsICYmIHRoaXMuX3BvcnRhbC5pc0F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9wb3J0YWw/LmRldGFjaCgpO1xuICAgIH1cbiAgfVxufVxuIl19