/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, InjectionToken, Inject, Optional, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatTabContent } from './tab-content';
import { MatTabLabel } from './tab-label';
// Boilerplate for applying mixins to MatTab.
/** @docs-private */
class MatTabBase {
}
const _MatTabMixinBase = mixinDisabled(MatTabBase);
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB_GROUP = new InjectionToken('MAT_TAB_GROUP');
let MatTab = /** @class */ (() => {
    let MatTab = class MatTab extends _MatTabMixinBase {
        constructor(_viewContainerRef, 
        /**
         * @deprecated `_closestTabGroup` parameter to become required.
         * @breaking-change 10.0.0
         */
        _closestTabGroup) {
            super();
            this._viewContainerRef = _viewContainerRef;
            this._closestTabGroup = _closestTabGroup;
            /** Plain text label for the tab, used when there is no template label. */
            this.textLabel = '';
            /** Portal that will be the hosted content of the tab */
            this._contentPortal = null;
            /** Emits whenever the internal state of the tab changes. */
            this._stateChanges = new Subject();
            /**
             * The relatively indexed position where 0 represents the center, negative is left, and positive
             * represents the right.
             */
            this.position = null;
            /**
             * The initial relatively index origin of the tab if it was created and selected after there
             * was already a selected tab. Provides context of what position the tab should originate from.
             */
            this.origin = null;
            /**
             * Whether the tab is currently active.
             */
            this.isActive = false;
        }
        /** Content for the tab label given by `<ng-template mat-tab-label>`. */
        get templateLabel() { return this._templateLabel; }
        set templateLabel(value) {
            // Only update the templateLabel via query if there is actually
            // a MatTabLabel found. This works around an issue where a user may have
            // manually set `templateLabel` during creation mode, which would then get clobbered
            // by `undefined` when this query resolves.
            if (value) {
                this._templateLabel = value;
            }
        }
        /** @docs-private */
        get content() {
            return this._contentPortal;
        }
        ngOnChanges(changes) {
            if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
                this._stateChanges.next();
            }
        }
        ngOnDestroy() {
            this._stateChanges.complete();
        }
        ngOnInit() {
            this._contentPortal = new TemplatePortal(this._explicitContent || this._implicitContent, this._viewContainerRef);
        }
    };
    __decorate([
        ContentChild(MatTabLabel),
        __metadata("design:type", MatTabLabel),
        __metadata("design:paramtypes", [MatTabLabel])
    ], MatTab.prototype, "templateLabel", null);
    __decorate([
        ContentChild(MatTabContent, { read: TemplateRef, static: true }),
        __metadata("design:type", TemplateRef)
    ], MatTab.prototype, "_explicitContent", void 0);
    __decorate([
        ViewChild(TemplateRef, { static: true }),
        __metadata("design:type", TemplateRef)
    ], MatTab.prototype, "_implicitContent", void 0);
    __decorate([
        Input('label'),
        __metadata("design:type", String)
    ], MatTab.prototype, "textLabel", void 0);
    __decorate([
        Input('aria-label'),
        __metadata("design:type", String)
    ], MatTab.prototype, "ariaLabel", void 0);
    __decorate([
        Input('aria-labelledby'),
        __metadata("design:type", String)
    ], MatTab.prototype, "ariaLabelledby", void 0);
    MatTab = __decorate([
        Component({
            selector: 'mat-tab',
            template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n",
            inputs: ['disabled'],
            // tslint:disable-next-line:validate-decorators
            changeDetection: ChangeDetectionStrategy.Default,
            encapsulation: ViewEncapsulation.None,
            exportAs: 'matTab'
        }),
        __param(1, Optional()), __param(1, Inject(MAT_TAB_GROUP)),
        __metadata("design:paramtypes", [ViewContainerRef, Object])
    ], MatTab);
    return MatTab;
})();
export { MatTab };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFHSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFLTCxXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsY0FBYyxFQUNkLE1BQU0sRUFDTixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUE2QixhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUd4Qyw2Q0FBNkM7QUFDN0Msb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVTtDQUFHO0FBQ25CLE1BQU0sZ0JBQWdCLEdBQ2xCLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUU5Qjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFXdEU7SUFBQSxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFPLFNBQVEsZ0JBQWdCO1FBZ0UxQyxZQUNVLGlCQUFtQztRQUMzQzs7O1dBR0c7UUFDdUMsZ0JBQXNCO1lBQ2hFLEtBQUssRUFBRSxDQUFDO1lBTkEsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtZQUtELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBTTtZQTlDbEUsMEVBQTBFO1lBQzFELGNBQVMsR0FBVyxFQUFFLENBQUM7WUFXdkMsd0RBQXdEO1lBQ2hELG1CQUFjLEdBQTBCLElBQUksQ0FBQztZQU9yRCw0REFBNEQ7WUFDbkQsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1lBRTdDOzs7ZUFHRztZQUNILGFBQVEsR0FBa0IsSUFBSSxDQUFDO1lBRS9COzs7ZUFHRztZQUNILFdBQU0sR0FBa0IsSUFBSSxDQUFDO1lBRTdCOztlQUVHO1lBQ0gsYUFBUSxHQUFHLEtBQUssQ0FBQztRQVVqQixDQUFDO1FBdkVELHdFQUF3RTtRQUV4RSxJQUFJLGFBQWEsS0FBa0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLGFBQWEsQ0FBQyxLQUFrQjtZQUNsQywrREFBK0Q7WUFDL0Qsd0VBQXdFO1lBQ3hFLG9GQUFvRjtZQUNwRiwyQ0FBMkM7WUFDM0MsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7YUFDN0I7UUFDSCxDQUFDO1FBMkJELG9CQUFvQjtRQUNwQixJQUFJLE9BQU87WUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQztRQWdDRCxXQUFXLENBQUMsT0FBc0I7WUFDaEMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzdFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0I7UUFDSCxDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUVELFFBQVE7WUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUNwQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlFLENBQUM7S0FHRixDQUFBO0lBdkZDO1FBREMsWUFBWSxDQUFDLFdBQVcsQ0FBQztrQ0FFRCxXQUFXO3lDQUFYLFdBQVc7K0NBRDRCO0lBZ0JoRTtRQURDLFlBQVksQ0FBQyxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztrQ0FDN0MsV0FBVztvREFBTTtJQUdLO1FBQXZDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUM7a0NBQW1CLFdBQVc7b0RBQU07SUFHM0Q7UUFBZixLQUFLLENBQUMsT0FBTyxDQUFDOzs2Q0FBd0I7SUFHbEI7UUFBcEIsS0FBSyxDQUFDLFlBQVksQ0FBQzs7NkNBQW1CO0lBTWI7UUFBekIsS0FBSyxDQUFDLGlCQUFpQixDQUFDOztrREFBd0I7SUFsQ3RDLE1BQU07UUFUbEIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFNBQVM7WUFDbkIseVJBQXVCO1lBQ3ZCLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNwQiwrQ0FBK0M7WUFDL0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87WUFDaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7WUFDckMsUUFBUSxFQUFFLFFBQVE7U0FDbkIsQ0FBQztRQXVFRyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7eUNBTFAsZ0JBQWdCO09BakVsQyxNQUFNLENBMEZsQjtJQUFELGFBQUM7S0FBQTtTQTFGWSxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRUYWJDb250ZW50fSBmcm9tICcuL3RhYi1jb250ZW50JztcbmltcG9ydCB7TWF0VGFiTGFiZWx9IGZyb20gJy4vdGFiLWxhYmVsJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRUYWJCYXNlIHt9XG5jb25zdCBfTWF0VGFiTWl4aW5CYXNlOiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRUYWJCYXNlID1cbiAgICBtaXhpbkRpc2FibGVkKE1hdFRhYkJhc2UpO1xuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIHRhYiBncm91cCB0byBhIHRhYiB3aXRob3V0IGNhdXNpbmcgYSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1RBQl9HUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNQVRfVEFCX0dST1VQJyk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWInLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi5odG1sJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRUYWInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWIgZXh0ZW5kcyBfTWF0VGFiTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LCBDYW5EaXNhYmxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKiBDb250ZW50IGZvciB0aGUgdGFiIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1hdFRhYkxhYmVsKVxuICBnZXQgdGVtcGxhdGVMYWJlbCgpOiBNYXRUYWJMYWJlbCB7IHJldHVybiB0aGlzLl90ZW1wbGF0ZUxhYmVsOyB9XG4gIHNldCB0ZW1wbGF0ZUxhYmVsKHZhbHVlOiBNYXRUYWJMYWJlbCkge1xuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSB0ZW1wbGF0ZUxhYmVsIHZpYSBxdWVyeSBpZiB0aGVyZSBpcyBhY3R1YWxseVxuICAgIC8vIGEgTWF0VGFiTGFiZWwgZm91bmQuIFRoaXMgd29ya3MgYXJvdW5kIGFuIGlzc3VlIHdoZXJlIGEgdXNlciBtYXkgaGF2ZVxuICAgIC8vIG1hbnVhbGx5IHNldCBgdGVtcGxhdGVMYWJlbGAgZHVyaW5nIGNyZWF0aW9uIG1vZGUsIHdoaWNoIHdvdWxkIHRoZW4gZ2V0IGNsb2JiZXJlZFxuICAgIC8vIGJ5IGB1bmRlZmluZWRgIHdoZW4gdGhpcyBxdWVyeSByZXNvbHZlcy5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlTGFiZWwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdGVtcGxhdGVMYWJlbDogTWF0VGFiTGFiZWw7XG5cbiAgLyoqXG4gICAqIFRlbXBsYXRlIHByb3ZpZGVkIGluIHRoZSB0YWIgY29udGVudCB0aGF0IHdpbGwgYmUgdXNlZCBpZiBwcmVzZW50LCB1c2VkIHRvIGVuYWJsZSBsYXp5LWxvYWRpbmdcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTWF0VGFiQ29udGVudCwge3JlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWV9KVxuICBfZXhwbGljaXRDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBUZW1wbGF0ZSBpbnNpZGUgdGhlIE1hdFRhYiB2aWV3IHRoYXQgY29udGFpbnMgYW4gYDxuZy1jb250ZW50PmAuICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSBfaW1wbGljaXRDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBQbGFpbiB0ZXh0IGxhYmVsIGZvciB0aGUgdGFiLCB1c2VkIHdoZW4gdGhlcmUgaXMgbm8gdGVtcGxhdGUgbGFiZWwuICovXG4gIEBJbnB1dCgnbGFiZWwnKSB0ZXh0TGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBBcmlhIGxhYmVsIGZvciB0aGUgdGFiLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgdGhlIHRhYiBpcyBsYWJlbGxlZCBieS5cbiAgICogV2lsbCBiZSBjbGVhcmVkIGlmIGBhcmlhLWxhYmVsYCBpcyBzZXQgYXQgdGhlIHNhbWUgdGltZS5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogUG9ydGFsIHRoYXQgd2lsbCBiZSB0aGUgaG9zdGVkIGNvbnRlbnQgb2YgdGhlIHRhYiAqL1xuICBwcml2YXRlIF9jb250ZW50UG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBjb250ZW50KCk6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQb3J0YWw7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSB0YWIgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSByZWxhdGl2ZWx5IGluZGV4ZWQgcG9zaXRpb24gd2hlcmUgMCByZXByZXNlbnRzIHRoZSBjZW50ZXIsIG5lZ2F0aXZlIGlzIGxlZnQsIGFuZCBwb3NpdGl2ZVxuICAgKiByZXByZXNlbnRzIHRoZSByaWdodC5cbiAgICovXG4gIHBvc2l0aW9uOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogVGhlIGluaXRpYWwgcmVsYXRpdmVseSBpbmRleCBvcmlnaW4gb2YgdGhlIHRhYiBpZiBpdCB3YXMgY3JlYXRlZCBhbmQgc2VsZWN0ZWQgYWZ0ZXIgdGhlcmVcbiAgICogd2FzIGFscmVhZHkgYSBzZWxlY3RlZCB0YWIuIFByb3ZpZGVzIGNvbnRleHQgb2Ygd2hhdCBwb3NpdGlvbiB0aGUgdGFiIHNob3VsZCBvcmlnaW5hdGUgZnJvbS5cbiAgICovXG4gIG9yaWdpbjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHRhYiBpcyBjdXJyZW50bHkgYWN0aXZlLlxuICAgKi9cbiAgaXNBY3RpdmUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBfY2xvc2VzdFRhYkdyb3VwYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAgICovXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfVEFCX0dST1VQKSBwdWJsaWMgX2Nsb3Nlc3RUYWJHcm91cD86IGFueSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RleHRMYWJlbCcpIHx8IGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZW50UG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKFxuICAgICAgICB0aGlzLl9leHBsaWNpdENvbnRlbnQgfHwgdGhpcy5faW1wbGljaXRDb250ZW50LCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19