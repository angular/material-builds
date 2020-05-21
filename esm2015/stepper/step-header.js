/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewEncapsulation, } from '@angular/core';
import { MatStepLabel } from './step-label';
import { MatStepperIntl } from './stepper-intl';
import { CdkStepHeader } from '@angular/cdk/stepper';
let MatStepHeader = /** @class */ (() => {
    let MatStepHeader = class MatStepHeader extends CdkStepHeader {
        constructor(_intl, _focusMonitor, _elementRef, changeDetectorRef) {
            super(_elementRef);
            this._intl = _intl;
            this._focusMonitor = _focusMonitor;
            _focusMonitor.monitor(_elementRef, true);
            this._intlSubscription = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
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
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatStepHeader.prototype, "state", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatStepHeader.prototype, "label", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatStepHeader.prototype, "errorMessage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatStepHeader.prototype, "iconOverrides", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], MatStepHeader.prototype, "index", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "selected", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "active", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "optional", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "disableRipple", void 0);
    MatStepHeader = __decorate([
        Component({
            selector: 'mat-step-header',
            template: "<div class=\"mat-step-header-ripple\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\" [ngSwitch]=\"!!(iconOverrides && iconOverrides[state])\">\n    <ng-container\n      *ngSwitchCase=\"true\"\n      [ngTemplateOutlet]=\"iconOverrides[state]\"\n      [ngTemplateOutletContext]=\"_getIconContext()\"></ng-container>\n    <ng-container *ngSwitchDefault [ngSwitch]=\"state\">\n      <span *ngSwitchCase=\"'number'\">{{_getDefaultTextForState(state)}}</span>\n      <mat-icon *ngSwitchDefault>{{_getDefaultTextForState(state)}}</mat-icon>\n    </ng-container>\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  <!-- If there is a label template, use it. -->\n  <ng-container *ngIf=\"_templateLabel()\" [ngTemplateOutlet]=\"_templateLabel()!.template\">\n  </ng-container>\n  <!-- If there is no label template, fall back to the text label. -->\n  <div class=\"mat-step-text-label\" *ngIf=\"_stringLabel()\">{{label}}</div>\n\n  <div class=\"mat-step-optional\" *ngIf=\"optional && state != 'error'\">{{_intl.optionalLabel}}</div>\n  <div class=\"mat-step-sub-label-error\" *ngIf=\"state == 'error'\">{{errorMessage}}</div>\n</div>\n\n",
            host: {
                'class': 'mat-step-header mat-focus-indicator',
                'role': 'tab',
            },
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:transparent}.mat-step-optional,.mat-step-sub-label-error{font-size:12px}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative}.mat-step-icon-content,.mat-step-icon .mat-icon{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"]
        }),
        __metadata("design:paramtypes", [MatStepperIntl,
            FocusMonitor,
            ElementRef,
            ChangeDetectorRef])
    ], MatStepHeader);
    return MatStepHeader;
})();
export { MatStepHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUVMLGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUMsYUFBYSxFQUFZLE1BQU0sc0JBQXNCLENBQUM7QUFjOUQ7SUFBQSxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEsYUFBYTtRQThCOUMsWUFDUyxLQUFxQixFQUNwQixhQUEyQixFQUNuQyxXQUFvQyxFQUNwQyxpQkFBb0M7WUFDcEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBSlosVUFBSyxHQUFMLEtBQUssQ0FBZ0I7WUFDcEIsa0JBQWEsR0FBYixhQUFhLENBQWM7WUFJbkMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDM0YsQ0FBQztRQUVELFdBQVc7WUFDVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCwrQkFBK0I7UUFDL0IsS0FBSztZQUNILElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELGdFQUFnRTtRQUNoRSxZQUFZO1lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxZQUFZLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hFLENBQUM7UUFFRCwyRUFBMkU7UUFDM0UsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRSxDQUFDO1FBRUQscUNBQXFDO1FBQ3JDLGVBQWU7WUFDYixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBQ3hDLENBQUM7UUFFRCxxRkFBcUY7UUFDckYsZUFBZTtZQUNiLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTthQUN4QixDQUFDO1FBQ0osQ0FBQztRQUVELHVCQUF1QixDQUFDLEtBQWdCO1lBQ3RDLElBQUksS0FBSyxJQUFJLFFBQVEsRUFBRTtnQkFDckIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7YUFDNUI7WUFDRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBQ25CLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1lBQ0QsSUFBSSxLQUFLLElBQUksT0FBTyxFQUFFO2dCQUNwQixPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztLQUNGLENBQUE7SUFsRlU7UUFBUixLQUFLLEVBQUU7O2dEQUFrQjtJQUdqQjtRQUFSLEtBQUssRUFBRTs7Z0RBQThCO0lBRzdCO1FBQVIsS0FBSyxFQUFFOzt1REFBc0I7SUFHckI7UUFBUixLQUFLLEVBQUU7O3dEQUFvRTtJQUduRTtRQUFSLEtBQUssRUFBRTs7Z0RBQWU7SUFHZDtRQUFSLEtBQUssRUFBRTs7bURBQW1CO0lBR2xCO1FBQVIsS0FBSyxFQUFFOztpREFBaUI7SUFHaEI7UUFBUixLQUFLLEVBQUU7O21EQUFtQjtJQUdsQjtRQUFSLEtBQUssRUFBRTs7d0RBQXdCO0lBNUJyQixhQUFhO1FBWHpCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsaStDQUErQjtZQUUvQixJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLHFDQUFxQztnQkFDOUMsTUFBTSxFQUFFLEtBQUs7YUFDZDtZQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztTQUNoRCxDQUFDO3lDQWdDZ0IsY0FBYztZQUNMLFlBQVk7WUFDdEIsVUFBVTtZQUNKLGlCQUFpQjtPQWxDM0IsYUFBYSxDQXNGekI7SUFBRCxvQkFBQztLQUFBO1NBdEZZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge01hdFN0ZXBwZXJJbnRsfSBmcm9tICcuL3N0ZXBwZXItaW50bCc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uQ29udGV4dH0gZnJvbSAnLi9zdGVwcGVyLWljb24nO1xuaW1wb3J0IHtDZGtTdGVwSGVhZGVyLCBTdGVwU3RhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc3RlcC1oZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXAtaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc3RlcC1oZWFkZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXAtaGVhZGVyIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdyb2xlJzogJ3RhYicsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwSGVhZGVyIGV4dGVuZHMgQ2RrU3RlcEhlYWRlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2ludGxTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogU3RhdGUgb2YgdGhlIGdpdmVuIHN0ZXAuICovXG4gIEBJbnB1dCgpIHN0YXRlOiBTdGVwU3RhdGU7XG5cbiAgLyoqIExhYmVsIG9mIHRoZSBnaXZlbiBzdGVwLiAqL1xuICBASW5wdXQoKSBsYWJlbDogTWF0U3RlcExhYmVsIHwgc3RyaW5nO1xuXG4gIC8qKiBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkgd2hlbiB0aGVyZSdzIGFuIGVycm9yLiAqL1xuICBASW5wdXQoKSBlcnJvck1lc3NhZ2U6IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGVzIGZvciB0aGUgaGVhZGVyIGljb25zLCBwYXNzZWQgaW4gdmlhIHRoZSBzdGVwcGVyLiAqL1xuICBASW5wdXQoKSBpY29uT3ZlcnJpZGVzOiB7W2tleTogc3RyaW5nXTogVGVtcGxhdGVSZWY8TWF0U3RlcHBlckljb25Db250ZXh0Pn07XG5cbiAgLyoqIEluZGV4IG9mIHRoZSBnaXZlbiBzdGVwLiAqL1xuICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiBzdGVwIGlzIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKSBzZWxlY3RlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gc3RlcCBsYWJlbCBpcyBhY3RpdmUuICovXG4gIEBJbnB1dCgpIGFjdGl2ZTogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gc3RlcCBpcyBvcHRpb25hbC4gKi9cbiAgQElucHV0KCkgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9pbnRsOiBNYXRTdGVwcGVySW50bCxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihfZWxlbWVudFJlZiwgdHJ1ZSk7XG4gICAgdGhpcy5faW50bFN1YnNjcmlwdGlvbiA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc3RlcCBoZWFkZXIuICovXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50UmVmLCAncHJvZ3JhbScpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgc3RyaW5nIGxhYmVsIG9mIGdpdmVuIHN0ZXAgaWYgaXQgaXMgYSB0ZXh0IGxhYmVsLiAqL1xuICBfc3RyaW5nTGFiZWwoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWwgaW5zdGFuY2VvZiBNYXRTdGVwTGFiZWwgPyBudWxsIDogdGhpcy5sYWJlbDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIE1hdFN0ZXBMYWJlbCBpZiB0aGUgbGFiZWwgb2YgZ2l2ZW4gc3RlcCBpcyBhIHRlbXBsYXRlIGxhYmVsLiAqL1xuICBfdGVtcGxhdGVMYWJlbCgpOiBNYXRTdGVwTGFiZWwgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCBpbnN0YW5jZW9mIE1hdFN0ZXBMYWJlbCA/IHRoaXMubGFiZWwgOiBudWxsO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGhvc3QgSFRNTCBlbGVtZW50LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBUZW1wbGF0ZSBjb250ZXh0IHZhcmlhYmxlcyB0aGF0IGFyZSBleHBvc2VkIHRvIHRoZSBgbWF0U3RlcHBlckljb25gIGluc3RhbmNlcy4gKi9cbiAgX2dldEljb25Db250ZXh0KCk6IE1hdFN0ZXBwZXJJY29uQ29udGV4dCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgYWN0aXZlOiB0aGlzLmFjdGl2ZSxcbiAgICAgIG9wdGlvbmFsOiB0aGlzLm9wdGlvbmFsXG4gICAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0VGV4dEZvclN0YXRlKHN0YXRlOiBTdGVwU3RhdGUpOiBzdHJpbmcge1xuICAgIGlmIChzdGF0ZSA9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGAke3RoaXMuaW5kZXggKyAxfWA7XG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PSAnZWRpdCcpIHtcbiAgICAgIHJldHVybiAnY3JlYXRlJztcbiAgICB9XG4gICAgaWYgKHN0YXRlID09ICdlcnJvcicpIHtcbiAgICAgIHJldHVybiAnd2FybmluZyc7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIl19