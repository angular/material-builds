/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, InjectionToken, Inject, Optional, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MAT_TAB_CONTENT } from './tab-content';
import { MAT_TAB_LABEL, MatTabLabel } from './tab-label';
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
    class MatTab extends _MatTabMixinBase {
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
        // TODO: Remove cast once https://github.com/angular/angular/pull/37506 is available.
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
    }
    MatTab.decorators = [
        { type: Component, args: [{
                    selector: 'mat-tab',
                    template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n",
                    inputs: ['disabled'],
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matTab'
                },] }
    ];
    MatTab.ctorParameters = () => [
        { type: ViewContainerRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_TAB_GROUP,] }] }
    ];
    MatTab.propDecorators = {
        templateLabel: [{ type: ContentChild, args: [MAT_TAB_LABEL,] }],
        _explicitContent: [{ type: ContentChild, args: [MAT_TAB_CONTENT, { read: TemplateRef, static: true },] }],
        _implicitContent: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
        textLabel: [{ type: Input, args: ['label',] }],
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }]
    };
    return MatTab;
})();
export { MatTab };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUtMLFdBQVcsRUFDWCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUd2RCw2Q0FBNkM7QUFDN0Msb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVTtDQUFHO0FBQ25CLE1BQU0sZ0JBQWdCLEdBQ2xCLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUU5Qjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFFdEU7SUFBQSxNQVNhLE1BQU8sU0FBUSxnQkFBZ0I7UUFrRTFDLFlBQ1UsaUJBQW1DO1FBQzNDOzs7V0FHRztRQUN1QyxnQkFBc0I7WUFDaEUsS0FBSyxFQUFFLENBQUM7WUFOQSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1lBS0QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFNO1lBOUNsRSwwRUFBMEU7WUFDMUQsY0FBUyxHQUFXLEVBQUUsQ0FBQztZQVd2Qyx3REFBd0Q7WUFDaEQsbUJBQWMsR0FBMEIsSUFBSSxDQUFDO1lBT3JELDREQUE0RDtZQUNuRCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7WUFFN0M7OztlQUdHO1lBQ0gsYUFBUSxHQUFrQixJQUFJLENBQUM7WUFFL0I7OztlQUdHO1lBQ0gsV0FBTSxHQUFrQixJQUFJLENBQUM7WUFFN0I7O2VBRUc7WUFDSCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBVWpCLENBQUM7UUF6RUQscUZBQXFGO1FBQ3JGLHdFQUF3RTtRQUN4RSxJQUNJLGFBQWEsS0FBa0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLGFBQWEsQ0FBQyxLQUFrQjtZQUNsQywrREFBK0Q7WUFDL0Qsd0VBQXdFO1lBQ3hFLG9GQUFvRjtZQUNwRiwyQ0FBMkM7WUFDM0MsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7YUFDN0I7UUFDSCxDQUFDO1FBNEJELG9CQUFvQjtRQUNwQixJQUFJLE9BQU87WUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQztRQWdDRCxXQUFXLENBQUMsT0FBc0I7WUFDaEMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzdFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0I7UUFDSCxDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUVELFFBQVE7WUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUNwQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlFLENBQUM7OztnQkFsR0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxTQUFTO29CQUNuQix5UkFBdUI7b0JBQ3ZCLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFDcEIsK0NBQStDO29CQUMvQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTztvQkFDaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFFBQVEsRUFBRSxRQUFRO2lCQUNuQjs7O2dCQWhDQyxnQkFBZ0I7Z0RBeUdiLFFBQVEsWUFBSSxNQUFNLFNBQUMsYUFBYTs7O2dDQXJFbEMsWUFBWSxTQUFDLGFBQW9CO21DQWlCakMsWUFBWSxTQUFDLGVBQXNCLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7bUNBSXRFLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDOzRCQUdyQyxLQUFLLFNBQUMsT0FBTzs0QkFHYixLQUFLLFNBQUMsWUFBWTtpQ0FNbEIsS0FBSyxTQUFDLGlCQUFpQjs7SUF3RDFCLGFBQUM7S0FBQTtTQTVGWSxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNQVRfVEFCX0NPTlRFTlR9IGZyb20gJy4vdGFiLWNvbnRlbnQnO1xuaW1wb3J0IHtNQVRfVEFCX0xBQkVMLCBNYXRUYWJMYWJlbH0gZnJvbSAnLi90YWItbGFiZWwnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFRhYkJhc2Uge31cbmNvbnN0IF9NYXRUYWJNaXhpbkJhc2U6IENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFRhYkJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0VGFiQmFzZSk7XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgdGFiIGdyb3VwIHRvIGEgdGFiIHdpdGhvdXQgY2F1c2luZyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVEFCX0dST1VQID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01BVF9UQUJfR1JPVVAnKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYicsXG4gIHRlbXBsYXRlVXJsOiAndGFiLmh0bWwnLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdFRhYicsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYiBleHRlbmRzIF9NYXRUYWJNaXhpbkJhc2UgaW1wbGVtZW50cyBPbkluaXQsIENhbkRpc2FibGUsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICAvKiogQ29udGVudCBmb3IgdGhlIHRhYiBsYWJlbCBnaXZlbiBieSBgPG5nLXRlbXBsYXRlIG1hdC10YWItbGFiZWw+YC4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfVEFCX0xBQkVMIGFzIGFueSlcbiAgZ2V0IHRlbXBsYXRlTGFiZWwoKTogTWF0VGFiTGFiZWwgeyByZXR1cm4gdGhpcy5fdGVtcGxhdGVMYWJlbDsgfVxuICBzZXQgdGVtcGxhdGVMYWJlbCh2YWx1ZTogTWF0VGFiTGFiZWwpIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgdGVtcGxhdGVMYWJlbCB2aWEgcXVlcnkgaWYgdGhlcmUgaXMgYWN0dWFsbHlcbiAgICAvLyBhIE1hdFRhYkxhYmVsIGZvdW5kLiBUaGlzIHdvcmtzIGFyb3VuZCBhbiBpc3N1ZSB3aGVyZSBhIHVzZXIgbWF5IGhhdmVcbiAgICAvLyBtYW51YWxseSBzZXQgYHRlbXBsYXRlTGFiZWxgIGR1cmluZyBjcmVhdGlvbiBtb2RlLCB3aGljaCB3b3VsZCB0aGVuIGdldCBjbG9iYmVyZWRcbiAgICAvLyBieSBgdW5kZWZpbmVkYCB3aGVuIHRoaXMgcXVlcnkgcmVzb2x2ZXMuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl90ZW1wbGF0ZUxhYmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3RlbXBsYXRlTGFiZWw6IE1hdFRhYkxhYmVsO1xuXG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgLyoqXG4gICAqIFRlbXBsYXRlIHByb3ZpZGVkIGluIHRoZSB0YWIgY29udGVudCB0aGF0IHdpbGwgYmUgdXNlZCBpZiBwcmVzZW50LCB1c2VkIHRvIGVuYWJsZSBsYXp5LWxvYWRpbmdcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX1RBQl9DT05URU5UIGFzIGFueSwge3JlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWV9KVxuICBfZXhwbGljaXRDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBUZW1wbGF0ZSBpbnNpZGUgdGhlIE1hdFRhYiB2aWV3IHRoYXQgY29udGFpbnMgYW4gYDxuZy1jb250ZW50PmAuICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSBfaW1wbGljaXRDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBQbGFpbiB0ZXh0IGxhYmVsIGZvciB0aGUgdGFiLCB1c2VkIHdoZW4gdGhlcmUgaXMgbm8gdGVtcGxhdGUgbGFiZWwuICovXG4gIEBJbnB1dCgnbGFiZWwnKSB0ZXh0TGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBBcmlhIGxhYmVsIGZvciB0aGUgdGFiLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgdGhlIHRhYiBpcyBsYWJlbGxlZCBieS5cbiAgICogV2lsbCBiZSBjbGVhcmVkIGlmIGBhcmlhLWxhYmVsYCBpcyBzZXQgYXQgdGhlIHNhbWUgdGltZS5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogUG9ydGFsIHRoYXQgd2lsbCBiZSB0aGUgaG9zdGVkIGNvbnRlbnQgb2YgdGhlIHRhYiAqL1xuICBwcml2YXRlIF9jb250ZW50UG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBjb250ZW50KCk6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQb3J0YWw7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSB0YWIgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSByZWxhdGl2ZWx5IGluZGV4ZWQgcG9zaXRpb24gd2hlcmUgMCByZXByZXNlbnRzIHRoZSBjZW50ZXIsIG5lZ2F0aXZlIGlzIGxlZnQsIGFuZCBwb3NpdGl2ZVxuICAgKiByZXByZXNlbnRzIHRoZSByaWdodC5cbiAgICovXG4gIHBvc2l0aW9uOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogVGhlIGluaXRpYWwgcmVsYXRpdmVseSBpbmRleCBvcmlnaW4gb2YgdGhlIHRhYiBpZiBpdCB3YXMgY3JlYXRlZCBhbmQgc2VsZWN0ZWQgYWZ0ZXIgdGhlcmVcbiAgICogd2FzIGFscmVhZHkgYSBzZWxlY3RlZCB0YWIuIFByb3ZpZGVzIGNvbnRleHQgb2Ygd2hhdCBwb3NpdGlvbiB0aGUgdGFiIHNob3VsZCBvcmlnaW5hdGUgZnJvbS5cbiAgICovXG4gIG9yaWdpbjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHRhYiBpcyBjdXJyZW50bHkgYWN0aXZlLlxuICAgKi9cbiAgaXNBY3RpdmUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBfY2xvc2VzdFRhYkdyb3VwYCBwYXJhbWV0ZXIgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAgICovXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfVEFCX0dST1VQKSBwdWJsaWMgX2Nsb3Nlc3RUYWJHcm91cD86IGFueSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RleHRMYWJlbCcpIHx8IGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZW50UG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKFxuICAgICAgICB0aGlzLl9leHBsaWNpdENvbnRlbnQgfHwgdGhpcy5faW1wbGljaXRDb250ZW50LCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19