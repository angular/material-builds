/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewEncapsulation, } from '@angular/core';
import { MatStepLabel } from './step-label';
import { MatStepperIntl } from './stepper-intl';
import { CdkStepHeader } from '@angular/cdk/stepper';
import { mixinColor } from '@angular/material/core';
// Boilerplate for applying mixins to MatStepHeader.
/** @docs-private */
class MatStepHeaderBase extends CdkStepHeader {
    constructor(elementRef) {
        super(elementRef);
    }
}
const _MatStepHeaderMixinBase = mixinColor(MatStepHeaderBase, 'primary');
export class MatStepHeader extends _MatStepHeaderMixinBase {
    constructor(_intl, _focusMonitor, _elementRef, changeDetectorRef) {
        super(_elementRef);
        this._intl = _intl;
        this._focusMonitor = _focusMonitor;
        this._intlSubscription = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnDestroy() {
        this._intlSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Focuses the step header. */
    focus() {
        this._focusMonitor.focusVia(this._elementRef, 'program');
    }
    /** Returns string label of given step if it is a text label. */
    _stringLabel() {
        return this.label instanceof MatStepLabel ? null : this.label;
    }
    /** Returns MatStepLabel if the label of given step is a template label. */
    _templateLabel() {
        return this.label instanceof MatStepLabel ? this.label : null;
    }
    /** Returns the host HTML element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /** Template context variables that are exposed to the `matStepperIcon` instances. */
    _getIconContext() {
        return {
            index: this.index,
            active: this.active,
            optional: this.optional
        };
    }
    _getDefaultTextForState(state) {
        if (state == 'number') {
            return `${this.index + 1}`;
        }
        if (state == 'edit') {
            return 'create';
        }
        if (state == 'error') {
            return 'warning';
        }
        return state;
    }
}
MatStepHeader.decorators = [
    { type: Component, args: [{
                selector: 'mat-step-header',
                template: "<div class=\"mat-step-header-ripple\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\" [ngSwitch]=\"!!(iconOverrides && iconOverrides[state])\">\n    <ng-container\n      *ngSwitchCase=\"true\"\n      [ngTemplateOutlet]=\"iconOverrides[state]\"\n      [ngTemplateOutletContext]=\"_getIconContext()\"></ng-container>\n    <ng-container *ngSwitchDefault [ngSwitch]=\"state\">\n      <span *ngSwitchCase=\"'number'\">{{_getDefaultTextForState(state)}}</span>\n      <mat-icon *ngSwitchDefault>{{_getDefaultTextForState(state)}}</mat-icon>\n    </ng-container>\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  <!-- If there is a label template, use it. -->\n  <div class=\"mat-step-text-label\" *ngIf=\"_templateLabel()\">\n    <ng-container [ngTemplateOutlet]=\"_templateLabel()!.template\"></ng-container>\n  </div>\n  <!-- If there is no label template, fall back to the text label. -->\n  <div class=\"mat-step-text-label\" *ngIf=\"_stringLabel()\">{{label}}</div>\n\n  <div class=\"mat-step-optional\" *ngIf=\"optional && state != 'error'\">{{_intl.optionalLabel}}</div>\n  <div class=\"mat-step-sub-label-error\" *ngIf=\"state == 'error'\">{{errorMessage}}</div>\n</div>\n\n",
                inputs: ['color'],
                host: {
                    'class': 'mat-step-header mat-focus-indicator',
                    'role': 'tab',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:transparent}.mat-step-optional,.mat-step-sub-label-error{font-size:12px}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative}.mat-step-icon-content,.mat-step-icon .mat-icon{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"]
            },] }
];
MatStepHeader.ctorParameters = () => [
    { type: MatStepperIntl },
    { type: FocusMonitor },
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
MatStepHeader.propDecorators = {
    state: [{ type: Input }],
    label: [{ type: Input }],
    errorMessage: [{ type: Input }],
    iconOverrides: [{ type: Input }],
    index: [{ type: Input }],
    selected: [{ type: Input }],
    active: [{ type: Input }],
    optional: [{ type: Input }],
    disableRipple: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBRUwsaUJBQWlCLEdBR2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBQyxhQUFhLEVBQVksTUFBTSxzQkFBc0IsQ0FBQztBQUM5RCxPQUFPLEVBQWUsVUFBVSxFQUFXLE1BQU0sd0JBQXdCLENBQUM7QUFHMUUsb0RBQW9EO0FBQ3BELG9CQUFvQjtBQUNwQixNQUFNLGlCQUFrQixTQUFRLGFBQWE7SUFDM0MsWUFBWSxVQUFzQjtRQUNoQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQsTUFBTSx1QkFBdUIsR0FDekIsVUFBVSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBYzdDLE1BQU0sT0FBTyxhQUFjLFNBQVEsdUJBQXVCO0lBK0J4RCxZQUNTLEtBQXFCLEVBQ3BCLGFBQTJCLEVBQ25DLFdBQW9DLEVBQ3BDLGlCQUFvQztRQUNwQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFKWixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNwQixrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUluQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUMzRixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCwrQkFBK0I7SUFDL0IsS0FBSztRQUNILElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELGdFQUFnRTtJQUNoRSxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxZQUFZLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2hFLENBQUM7SUFFRCwyRUFBMkU7SUFDM0UsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNoRSxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxxRkFBcUY7SUFDckYsZUFBZTtRQUNiLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO0lBQ0osQ0FBQztJQUVELHVCQUF1QixDQUFDLEtBQWdCO1FBQ3RDLElBQUksS0FBSyxJQUFJLFFBQVEsRUFBRTtZQUNyQixPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztTQUM1QjtRQUNELElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtZQUNuQixPQUFPLFFBQVEsQ0FBQztTQUNqQjtRQUNELElBQUksS0FBSyxJQUFJLE9BQU8sRUFBRTtZQUNwQixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7O1lBckdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixnaERBQStCO2dCQUUvQixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUscUNBQXFDO29CQUM5QyxNQUFNLEVBQUUsS0FBSztpQkFDZDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7WUE1Qk8sY0FBYztZQWRkLFlBQVk7WUFLbEIsVUFBVTtZQUZWLGlCQUFpQjs7O29CQTZDaEIsS0FBSztvQkFHTCxLQUFLOzJCQUdMLEtBQUs7NEJBR0wsS0FBSztvQkFHTCxLQUFLO3VCQUdMLEtBQUs7cUJBR0wsS0FBSzt1QkFHTCxLQUFLOzRCQUdMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVGVtcGxhdGVSZWYsXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge01hdFN0ZXBwZXJJbnRsfSBmcm9tICcuL3N0ZXBwZXItaW50bCc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uQ29udGV4dH0gZnJvbSAnLi9zdGVwcGVyLWljb24nO1xuaW1wb3J0IHtDZGtTdGVwSGVhZGVyLCBTdGVwU3RhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7Q2FuQ29sb3JDdG9yLCBtaXhpbkNvbG9yLCBDYW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRTdGVwSGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFN0ZXBIZWFkZXJCYXNlIGV4dGVuZHMgQ2RrU3RlcEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgfVxufVxuXG5jb25zdCBfTWF0U3RlcEhlYWRlck1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdFN0ZXBIZWFkZXJCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdFN0ZXBIZWFkZXJCYXNlLCAncHJpbWFyeScpO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc3RlcC1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXAtaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc3RlcC1oZWFkZXIuY3NzJ10sXG4gIGlucHV0czogWydjb2xvciddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zdGVwLWhlYWRlciBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAncm9sZSc6ICd0YWInLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcEhlYWRlciBleHRlbmRzIF9NYXRTdGVwSGVhZGVyTWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LFxuICBDYW5Db2xvciB7XG4gIHByaXZhdGUgX2ludGxTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogU3RhdGUgb2YgdGhlIGdpdmVuIHN0ZXAuICovXG4gIEBJbnB1dCgpIHN0YXRlOiBTdGVwU3RhdGU7XG5cbiAgLyoqIExhYmVsIG9mIHRoZSBnaXZlbiBzdGVwLiAqL1xuICBASW5wdXQoKSBsYWJlbDogTWF0U3RlcExhYmVsIHwgc3RyaW5nO1xuXG4gIC8qKiBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkgd2hlbiB0aGVyZSdzIGFuIGVycm9yLiAqL1xuICBASW5wdXQoKSBlcnJvck1lc3NhZ2U6IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGVzIGZvciB0aGUgaGVhZGVyIGljb25zLCBwYXNzZWQgaW4gdmlhIHRoZSBzdGVwcGVyLiAqL1xuICBASW5wdXQoKSBpY29uT3ZlcnJpZGVzOiB7W2tleTogc3RyaW5nXTogVGVtcGxhdGVSZWY8TWF0U3RlcHBlckljb25Db250ZXh0Pn07XG5cbiAgLyoqIEluZGV4IG9mIHRoZSBnaXZlbiBzdGVwLiAqL1xuICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiBzdGVwIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKSBzZWxlY3RlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gc3RlcCBsYWJlbCBpcyBhY3RpdmUuICovXG4gIEBJbnB1dCgpIGFjdGl2ZTogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gc3RlcCBpcyBvcHRpb25hbC4gKi9cbiAgQElucHV0KCkgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9pbnRsOiBNYXRTdGVwcGVySW50bCxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2ludGxTdWJzY3JpcHRpb24gPSBfaW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiBjaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9pbnRsU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHN0ZXAgaGVhZGVyLiAqL1xuICBmb2N1cygpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudFJlZiwgJ3Byb2dyYW0nKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHN0cmluZyBsYWJlbCBvZiBnaXZlbiBzdGVwIGlmIGl0IGlzIGEgdGV4dCBsYWJlbC4gKi9cbiAgX3N0cmluZ0xhYmVsKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmxhYmVsIGluc3RhbmNlb2YgTWF0U3RlcExhYmVsID8gbnVsbCA6IHRoaXMubGFiZWw7XG4gIH1cblxuICAvKiogUmV0dXJucyBNYXRTdGVwTGFiZWwgaWYgdGhlIGxhYmVsIG9mIGdpdmVuIHN0ZXAgaXMgYSB0ZW1wbGF0ZSBsYWJlbC4gKi9cbiAgX3RlbXBsYXRlTGFiZWwoKTogTWF0U3RlcExhYmVsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWwgaW5zdGFuY2VvZiBNYXRTdGVwTGFiZWwgPyB0aGlzLmxhYmVsIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBob3N0IEhUTUwgZWxlbWVudC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogVGVtcGxhdGUgY29udGV4dCB2YXJpYWJsZXMgdGhhdCBhcmUgZXhwb3NlZCB0byB0aGUgYG1hdFN0ZXBwZXJJY29uYCBpbnN0YW5jZXMuICovXG4gIF9nZXRJY29uQ29udGV4dCgpOiBNYXRTdGVwcGVySWNvbkNvbnRleHQge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIGFjdGl2ZTogdGhpcy5hY3RpdmUsXG4gICAgICBvcHRpb25hbDogdGhpcy5vcHRpb25hbFxuICAgIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdFRleHRGb3JTdGF0ZShzdGF0ZTogU3RlcFN0YXRlKTogc3RyaW5nIHtcbiAgICBpZiAoc3RhdGUgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLmluZGV4ICsgMX1gO1xuICAgIH1cbiAgICBpZiAoc3RhdGUgPT0gJ2VkaXQnKSB7XG4gICAgICByZXR1cm4gJ2NyZWF0ZSc7XG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PSAnZXJyb3InKSB7XG4gICAgICByZXR1cm4gJ3dhcm5pbmcnO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiJdfQ==