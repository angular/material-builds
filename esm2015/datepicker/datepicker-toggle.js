/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, Input, ViewEncapsulation, ViewChild, } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatDatepickerBase } from './datepicker-base';
/** Can be used to override the icon of a `matDatepickerToggle`. */
let MatDatepickerToggleIcon = /** @class */ (() => {
    let MatDatepickerToggleIcon = class MatDatepickerToggleIcon {
    };
    MatDatepickerToggleIcon = __decorate([
        Directive({
            selector: '[matDatepickerToggleIcon]'
        })
    ], MatDatepickerToggleIcon);
    return MatDatepickerToggleIcon;
})();
export { MatDatepickerToggleIcon };
let MatDatepickerToggle = /** @class */ (() => {
    let MatDatepickerToggle = class MatDatepickerToggle {
        constructor(_intl, _changeDetectorRef, defaultTabIndex) {
            this._intl = _intl;
            this._changeDetectorRef = _changeDetectorRef;
            this._stateChanges = Subscription.EMPTY;
            const parsedTabIndex = Number(defaultTabIndex);
            this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
        }
        /** Whether the toggle button is disabled. */
        get disabled() {
            if (this._disabled === undefined && this.datepicker) {
                return this.datepicker.disabled;
            }
            return !!this._disabled;
        }
        set disabled(value) {
            this._disabled = coerceBooleanProperty(value);
        }
        ngOnChanges(changes) {
            if (changes['datepicker']) {
                this._watchStateChanges();
            }
        }
        ngOnDestroy() {
            this._stateChanges.unsubscribe();
        }
        ngAfterContentInit() {
            this._watchStateChanges();
        }
        _open(event) {
            if (this.datepicker && !this.disabled) {
                this.datepicker.open();
                event.stopPropagation();
            }
        }
        _watchStateChanges() {
            const datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : observableOf();
            const inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
                this.datepicker._datepickerInput._disabledChange : observableOf();
            const datepickerToggled = this.datepicker ?
                merge(this.datepicker.openedStream, this.datepicker.closedStream) :
                observableOf();
            this._stateChanges.unsubscribe();
            this._stateChanges = merge(this._intl.changes, datepickerDisabled, inputDisabled, datepickerToggled).subscribe(() => this._changeDetectorRef.markForCheck());
        }
    };
    __decorate([
        Input('for'),
        __metadata("design:type", MatDatepickerBase)
    ], MatDatepickerToggle.prototype, "datepicker", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatDatepickerToggle.prototype, "tabIndex", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDatepickerToggle.prototype, "disabled", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatDatepickerToggle.prototype, "disableRipple", void 0);
    __decorate([
        ContentChild(MatDatepickerToggleIcon),
        __metadata("design:type", MatDatepickerToggleIcon)
    ], MatDatepickerToggle.prototype, "_customIcon", void 0);
    __decorate([
        ViewChild('button'),
        __metadata("design:type", MatButton)
    ], MatDatepickerToggle.prototype, "_button", void 0);
    MatDatepickerToggle = __decorate([
        Component({
            selector: 'mat-datepicker-toggle',
            template: "<button\n  #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"_intl.openCalendarLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\"\n  (click)=\"_open($event)\">\n\n  <svg\n    *ngIf=\"!_customIcon\"\n    class=\"mat-datepicker-toggle-default-icon\"\n    viewBox=\"0 0 24 24\"\n    width=\"24px\"\n    height=\"24px\"\n    fill=\"currentColor\"\n    focusable=\"false\">\n    <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n  </svg>\n\n  <ng-content select=\"[matDatepickerToggleIcon]\"></ng-content>\n</button>\n",
            host: {
                'class': 'mat-datepicker-toggle',
                // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
                // consumer may have provided, while still being able to receive focus.
                '[attr.tabindex]': 'disabled ? null : -1',
                '[class.mat-datepicker-toggle-active]': 'datepicker && datepicker.opened',
                '[class.mat-accent]': 'datepicker && datepicker.color === "accent"',
                '[class.mat-warn]': 'datepicker && datepicker.color === "warn"',
                '(focus)': '_button.focus()',
            },
            exportAs: 'matDatepickerToggle',
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-form-field-appearance-legacy .mat-form-field-prefix .mat-datepicker-toggle-default-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-datepicker-toggle-default-icon{width:1em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-datepicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-datepicker-toggle-default-icon{display:block;width:1.5em;height:1.5em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-datepicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-datepicker-toggle-default-icon{margin:auto}\n"]
        }),
        __param(2, Attribute('tabindex')),
        __metadata("design:paramtypes", [MatDatepickerIntl,
            ChangeDetectorRef, String])
    ], MatDatepickerToggle);
    return MatDatepickerToggle;
})();
export { MatDatepickerToggle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci10b2dnbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLXRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULEtBQUssRUFJTCxpQkFBaUIsRUFDakIsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxpQkFBaUIsRUFBdUIsTUFBTSxtQkFBbUIsQ0FBQztBQUcxRSxtRUFBbUU7QUFJbkU7SUFBQSxJQUFhLHVCQUF1QixHQUFwQyxNQUFhLHVCQUF1QjtLQUFHLENBQUE7SUFBMUIsdUJBQXVCO1FBSG5DLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwyQkFBMkI7U0FDdEMsQ0FBQztPQUNXLHVCQUF1QixDQUFHO0lBQUQsOEJBQUM7S0FBQTtTQUExQix1QkFBdUI7QUFxQnBDO0lBQUEsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7UUFnQzlCLFlBQ1MsS0FBd0IsRUFDdkIsa0JBQXFDLEVBQ3RCLGVBQXVCO1lBRnZDLFVBQUssR0FBTCxLQUFLLENBQW1CO1lBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7WUFqQ3ZDLGtCQUFhLEdBQUcsWUFBWSxDQUFDLEtB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Q2pDLCt2QkFBcUM7WUFFckMsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSx1QkFBdUI7Z0JBQ2hDLHdGQUF3RjtnQkFDeEYsdUVBQXVFO2dCQUN2RSxpQkFBaUIsRUFBRSxzQkFBc0I7Z0JBQ3pDLHNDQUFzQyxFQUFFLGlDQUFpQztnQkFDekUsb0JBQW9CLEVBQUUsNkNBQTZDO2dCQUNuRSxrQkFBa0IsRUFBRSwyQ0FBMkM7Z0JBQy9ELFNBQVMsRUFBRSxpQkFBaUI7YUFDN0I7WUFDRCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztTQUNoRCxDQUFDO1FBb0NHLFdBQUEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO3lDQUZSLGlCQUFpQjtZQUNILGlCQUFpQjtPQWxDcEMsbUJBQW1CLENBZ0YvQjtJQUFELDBCQUFDO0tBQUE7U0FoRlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0QnV0dG9ufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHttZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQmFzZSwgTWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcblxuXG4vKiogQ2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGljb24gb2YgYSBgbWF0RGF0ZXBpY2tlclRvZ2dsZWAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0RGF0ZXBpY2tlclRvZ2dsZUljb25dJ1xufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VyVG9nZ2xlSWNvbiB7fVxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlcGlja2VyLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZXBpY2tlci10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlcGlja2VyLXRvZ2dsZS5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZXBpY2tlci10b2dnbGUnLFxuICAgIC8vIEFsd2F5cyBzZXQgdGhlIHRhYmluZGV4IHRvIC0xIHNvIHRoYXQgaXQgZG9lc24ndCBvdmVybGFwIHdpdGggYW55IGN1c3RvbSB0YWJpbmRleCB0aGVcbiAgICAvLyBjb25zdW1lciBtYXkgaGF2ZSBwcm92aWRlZCwgd2hpbGUgc3RpbGwgYmVpbmcgYWJsZSB0byByZWNlaXZlIGZvY3VzLlxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnZGlzYWJsZWQgPyBudWxsIDogLTEnLFxuICAgICdbY2xhc3MubWF0LWRhdGVwaWNrZXItdG9nZ2xlLWFjdGl2ZV0nOiAnZGF0ZXBpY2tlciAmJiBkYXRlcGlja2VyLm9wZW5lZCcsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdkYXRlcGlja2VyICYmIGRhdGVwaWNrZXIuY29sb3IgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2RhdGVwaWNrZXIgJiYgZGF0ZXBpY2tlci5jb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgICcoZm9jdXMpJzogJ19idXR0b24uZm9jdXMoKScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlclRvZ2dsZScsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VyVG9nZ2xlPEQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9zdGF0ZUNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIERhdGVwaWNrZXIgaW5zdGFuY2UgdGhhdCB0aGUgYnV0dG9uIHdpbGwgdG9nZ2xlLiAqL1xuICBASW5wdXQoJ2ZvcicpIGRhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXJCYXNlPE1hdERhdGVwaWNrZXJDb250cm9sPGFueT4sIEQ+O1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIHRvZ2dsZS4gKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGVwaWNrZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGVwaWNrZXIuZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gdGhlIHRvZ2dsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIEN1c3RvbSBpY29uIHNldCBieSB0aGUgY29uc3VtZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0RGF0ZXBpY2tlclRvZ2dsZUljb24pIF9jdXN0b21JY29uOiBNYXREYXRlcGlja2VyVG9nZ2xlSWNvbjtcblxuICAvKiogVW5kZXJseWluZyBidXR0b24gZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnYnV0dG9uJykgX2J1dHRvbjogTWF0QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfaW50bDogTWF0RGF0ZXBpY2tlckludGwsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgZGVmYXVsdFRhYkluZGV4OiBzdHJpbmcpIHtcblxuICAgIGNvbnN0IHBhcnNlZFRhYkluZGV4ID0gTnVtYmVyKGRlZmF1bHRUYWJJbmRleCk7XG4gICAgdGhpcy50YWJJbmRleCA9IChwYXJzZWRUYWJJbmRleCB8fCBwYXJzZWRUYWJJbmRleCA9PT0gMCkgPyBwYXJzZWRUYWJJbmRleCA6IG51bGw7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ2RhdGVwaWNrZXInXSkge1xuICAgICAgdGhpcy5fd2F0Y2hTdGF0ZUNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl93YXRjaFN0YXRlQ2hhbmdlcygpO1xuICB9XG5cbiAgX29wZW4oZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlciAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLm9wZW4oKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoU3RhdGVDaGFuZ2VzKCkge1xuICAgIGNvbnN0IGRhdGVwaWNrZXJEaXNhYmxlZCA9IHRoaXMuZGF0ZXBpY2tlciA/IHRoaXMuZGF0ZXBpY2tlci5fZGlzYWJsZWRDaGFuZ2UgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBpbnB1dERpc2FibGVkID0gdGhpcy5kYXRlcGlja2VyICYmIHRoaXMuZGF0ZXBpY2tlci5fZGF0ZXBpY2tlcklucHV0ID9cbiAgICAgICAgdGhpcy5kYXRlcGlja2VyLl9kYXRlcGlja2VySW5wdXQuX2Rpc2FibGVkQ2hhbmdlIDogb2JzZXJ2YWJsZU9mKCk7XG4gICAgY29uc3QgZGF0ZXBpY2tlclRvZ2dsZWQgPSB0aGlzLmRhdGVwaWNrZXIgP1xuICAgICAgICBtZXJnZSh0aGlzLmRhdGVwaWNrZXIub3BlbmVkU3RyZWFtLCB0aGlzLmRhdGVwaWNrZXIuY2xvc2VkU3RyZWFtKSA6XG4gICAgICAgIG9ic2VydmFibGVPZigpO1xuXG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzID0gbWVyZ2UoXG4gICAgICB0aGlzLl9pbnRsLmNoYW5nZXMsXG4gICAgICBkYXRlcGlja2VyRGlzYWJsZWQsXG4gICAgICBpbnB1dERpc2FibGVkLFxuICAgICAgZGF0ZXBpY2tlclRvZ2dsZWRcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==