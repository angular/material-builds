/**
 * @fileoverview added by tsickle
 * Generated from: src/material/datepicker/datepicker-toggle.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, Input, ViewEncapsulation, ViewChild, } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { MatDatepicker } from './datepicker';
import { MatDatepickerIntl } from './datepicker-intl';
/**
 * Can be used to override the icon of a `matDatepickerToggle`.
 */
export class MatDatepickerToggleIcon {
}
MatDatepickerToggleIcon.decorators = [
    { type: Directive, args: [{
                selector: '[matDatepickerToggleIcon]'
            },] }
];
/**
 * @template D
 */
export class MatDatepickerToggle {
    /**
     * @param {?} _intl
     * @param {?} _changeDetectorRef
     * @param {?} defaultTabIndex
     */
    constructor(_intl, _changeDetectorRef, defaultTabIndex) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
        /** @type {?} */
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
    }
    /**
     * Whether the toggle button is disabled.
     * @return {?}
     */
    get disabled() {
        if (this._disabled === undefined && this.datepicker) {
            return this.datepicker.disabled;
        }
        return !!this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['datepicker']) {
            this._watchStateChanges();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.unsubscribe();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._watchStateChanges();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _open(event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    }
    /**
     * @private
     * @return {?}
     */
    _watchStateChanges() {
        /** @type {?} */
        const datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : observableOf();
        /** @type {?} */
        const inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
            this.datepicker._datepickerInput._disabledChange : observableOf();
        /** @type {?} */
        const datepickerToggled = this.datepicker ?
            merge(this.datepicker.openedStream, this.datepicker.closedStream) :
            observableOf();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(this._intl.changes, datepickerDisabled, inputDisabled, datepickerToggled).subscribe((/**
         * @return {?}
         */
        () => this._changeDetectorRef.markForCheck()));
    }
}
MatDatepickerToggle.decorators = [
    { type: Component, args: [{
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
            }] }
];
/** @nocollapse */
MatDatepickerToggle.ctorParameters = () => [
    { type: MatDatepickerIntl },
    { type: ChangeDetectorRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] }
];
MatDatepickerToggle.propDecorators = {
    datepicker: [{ type: Input, args: ['for',] }],
    tabIndex: [{ type: Input }],
    disabled: [{ type: Input }],
    disableRipple: [{ type: Input }],
    _customIcon: [{ type: ContentChild, args: [MatDatepickerToggleIcon,] }],
    _button: [{ type: ViewChild, args: ['button',] }]
};
if (false) {
    /** @type {?} */
    MatDatepickerToggle.ngAcceptInputType_disabled;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerToggle.prototype._stateChanges;
    /**
     * Datepicker instance that the button will toggle.
     * @type {?}
     */
    MatDatepickerToggle.prototype.datepicker;
    /**
     * Tabindex for the toggle.
     * @type {?}
     */
    MatDatepickerToggle.prototype.tabIndex;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerToggle.prototype._disabled;
    /**
     * Whether ripples on the toggle should be disabled.
     * @type {?}
     */
    MatDatepickerToggle.prototype.disableRipple;
    /**
     * Custom icon set by the consumer.
     * @type {?}
     */
    MatDatepickerToggle.prototype._customIcon;
    /**
     * Underlying button element.
     * @type {?}
     */
    MatDatepickerToggle.prototype._button;
    /** @type {?} */
    MatDatepickerToggle.prototype._intl;
    /**
     * @type {?}
     * @private
     */
    MatDatepickerToggle.prototype._changeDetectorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci10b2dnbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLXRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsS0FBSyxFQUlMLGlCQUFpQixFQUNqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7OztBQU9wRCxNQUFNLE9BQU8sdUJBQXVCOzs7WUFIbkMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwyQkFBMkI7YUFDdEM7Ozs7O0FBc0JELE1BQU0sT0FBTyxtQkFBbUI7Ozs7OztJQWdDOUIsWUFDUyxLQUF3QixFQUN2QixrQkFBcUMsRUFDdEIsZUFBdUI7UUFGdkMsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDdkIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQWpDdkMsa0JBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDOztjQW9DbkMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLGNBQWMsSUFBSSxjQUFjLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ25GLENBQUM7Ozs7O0lBN0JELElBQ0ksUUFBUTtRQUNWLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDOzs7OztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs7OztJQXFCRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDOzs7OztJQUVELEtBQUssQ0FBQyxLQUFZO1FBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDOzs7OztJQUVPLGtCQUFrQjs7Y0FDbEIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRTs7Y0FDdkYsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUU7O2NBQy9ELGlCQUFpQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ25FLFlBQVksRUFBRTtRQUVsQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDbEIsa0JBQWtCLEVBQ2xCLGFBQWEsRUFDYixpQkFBaUIsQ0FDbEIsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLEVBQUMsQ0FBQztJQUM1RCxDQUFDOzs7WUEvRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLCt2QkFBcUM7Z0JBRXJDLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsdUJBQXVCOzs7b0JBR2hDLGlCQUFpQixFQUFFLHNCQUFzQjtvQkFDekMsc0NBQXNDLEVBQUUsaUNBQWlDO29CQUN6RSxvQkFBb0IsRUFBRSw2Q0FBNkM7b0JBQ25FLGtCQUFrQixFQUFFLDJDQUEyQztvQkFDL0QsU0FBUyxFQUFFLGlCQUFpQjtpQkFDN0I7Z0JBQ0QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQTNCTyxpQkFBaUI7WUFkdkIsaUJBQWlCO3lDQTZFZCxTQUFTLFNBQUMsVUFBVTs7O3lCQS9CdEIsS0FBSyxTQUFDLEtBQUs7dUJBR1gsS0FBSzt1QkFHTCxLQUFLOzRCQWNMLEtBQUs7MEJBR0wsWUFBWSxTQUFDLHVCQUF1QjtzQkFHcEMsU0FBUyxTQUFDLFFBQVE7Ozs7SUFpRG5CLCtDQUFnRDs7Ozs7SUE5RWhELDRDQUEyQzs7Ozs7SUFHM0MseUNBQTJDOzs7OztJQUczQyx1Q0FBaUM7Ozs7O0lBY2pDLHdDQUEyQjs7Ozs7SUFHM0IsNENBQWdDOzs7OztJQUdoQywwQ0FBNEU7Ozs7O0lBRzVFLHNDQUF3Qzs7SUFHdEMsb0NBQStCOzs7OztJQUMvQixpREFBNkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRCdXR0b259IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge21lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnRsfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5cblxuLyoqIENhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBpY29uIG9mIGEgYG1hdERhdGVwaWNrZXJUb2dnbGVgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdERhdGVwaWNrZXJUb2dnbGVJY29uXSdcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlclRvZ2dsZUljb24ge31cblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZXBpY2tlci10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGVwaWNrZXItdG9nZ2xlLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGF0ZXBpY2tlci10b2dnbGUuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItdG9nZ2xlJyxcbiAgICAvLyBBbHdheXMgc2V0IHRoZSB0YWJpbmRleCB0byAtMSBzbyB0aGF0IGl0IGRvZXNuJ3Qgb3ZlcmxhcCB3aXRoIGFueSBjdXN0b20gdGFiaW5kZXggdGhlXG4gICAgLy8gY29uc3VtZXIgbWF5IGhhdmUgcHJvdmlkZWQsIHdoaWxlIHN0aWxsIGJlaW5nIGFibGUgdG8gcmVjZWl2ZSBmb2N1cy5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gbnVsbCA6IC0xJyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlcGlja2VyLXRvZ2dsZS1hY3RpdmVdJzogJ2RhdGVwaWNrZXIgJiYgZGF0ZXBpY2tlci5vcGVuZWQnLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnZGF0ZXBpY2tlciAmJiBkYXRlcGlja2VyLmNvbG9yID09PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdkYXRlcGlja2VyICYmIGRhdGVwaWNrZXIuY29sb3IgPT09IFwid2FyblwiJyxcbiAgICAnKGZvY3VzKSc6ICdfYnV0dG9uLmZvY3VzKCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdERhdGVwaWNrZXJUb2dnbGUnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlclRvZ2dsZTxEPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc3RhdGVDaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBEYXRlcGlja2VyIGluc3RhbmNlIHRoYXQgdGhlIGJ1dHRvbiB3aWxsIHRvZ2dsZS4gKi9cbiAgQElucHV0KCdmb3InKSBkYXRlcGlja2VyOiBNYXREYXRlcGlja2VyPEQ+O1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIHRvZ2dsZS4gKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGVwaWNrZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGVwaWNrZXIuZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gdGhlIHRvZ2dsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIEN1c3RvbSBpY29uIHNldCBieSB0aGUgY29uc3VtZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0RGF0ZXBpY2tlclRvZ2dsZUljb24pIF9jdXN0b21JY29uOiBNYXREYXRlcGlja2VyVG9nZ2xlSWNvbjtcblxuICAvKiogVW5kZXJseWluZyBidXR0b24gZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnYnV0dG9uJykgX2J1dHRvbjogTWF0QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfaW50bDogTWF0RGF0ZXBpY2tlckludGwsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgZGVmYXVsdFRhYkluZGV4OiBzdHJpbmcpIHtcblxuICAgIGNvbnN0IHBhcnNlZFRhYkluZGV4ID0gTnVtYmVyKGRlZmF1bHRUYWJJbmRleCk7XG4gICAgdGhpcy50YWJJbmRleCA9IChwYXJzZWRUYWJJbmRleCB8fCBwYXJzZWRUYWJJbmRleCA9PT0gMCkgPyBwYXJzZWRUYWJJbmRleCA6IG51bGw7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ2RhdGVwaWNrZXInXSkge1xuICAgICAgdGhpcy5fd2F0Y2hTdGF0ZUNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl93YXRjaFN0YXRlQ2hhbmdlcygpO1xuICB9XG5cbiAgX29wZW4oZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlciAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLm9wZW4oKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoU3RhdGVDaGFuZ2VzKCkge1xuICAgIGNvbnN0IGRhdGVwaWNrZXJEaXNhYmxlZCA9IHRoaXMuZGF0ZXBpY2tlciA/IHRoaXMuZGF0ZXBpY2tlci5fZGlzYWJsZWRDaGFuZ2UgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBpbnB1dERpc2FibGVkID0gdGhpcy5kYXRlcGlja2VyICYmIHRoaXMuZGF0ZXBpY2tlci5fZGF0ZXBpY2tlcklucHV0ID9cbiAgICAgICAgdGhpcy5kYXRlcGlja2VyLl9kYXRlcGlja2VySW5wdXQuX2Rpc2FibGVkQ2hhbmdlIDogb2JzZXJ2YWJsZU9mKCk7XG4gICAgY29uc3QgZGF0ZXBpY2tlclRvZ2dsZWQgPSB0aGlzLmRhdGVwaWNrZXIgP1xuICAgICAgICBtZXJnZSh0aGlzLmRhdGVwaWNrZXIub3BlbmVkU3RyZWFtLCB0aGlzLmRhdGVwaWNrZXIuY2xvc2VkU3RyZWFtKSA6XG4gICAgICAgIG9ic2VydmFibGVPZigpO1xuXG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzID0gbWVyZ2UoXG4gICAgICB0aGlzLl9pbnRsLmNoYW5nZXMsXG4gICAgICBkYXRlcGlja2VyRGlzYWJsZWQsXG4gICAgICBpbnB1dERpc2FibGVkLFxuICAgICAgZGF0ZXBpY2tlclRvZ2dsZWRcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==