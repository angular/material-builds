/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, Inject, InjectionToken, Input, Optional, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { MatTabContent } from './tab-content';
import { MAT_TAB, MatTabLabel } from './tab-label';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB_GROUP = new InjectionToken('MAT_TAB_GROUP');
export class MatTab {
    /** Content for the tab label given by `<ng-template mat-tab-label>`. */
    get templateLabel() {
        return this._templateLabel;
    }
    set templateLabel(value) {
        this._setTemplateLabelInput(value);
    }
    /** @docs-private */
    get content() {
        return this._contentPortal;
    }
    constructor(_viewContainerRef, _closestTabGroup) {
        this._viewContainerRef = _viewContainerRef;
        this._closestTabGroup = _closestTabGroup;
        /** whether the tab is disabled. */
        this.disabled = false;
        /**
         * Template provided in the tab content that will be used if present, used to enable lazy-loading
         */
        this._explicitContent = undefined;
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
    /**
     * This has been extracted to a util because of TS 4 and VE.
     * View Engine doesn't support property rename inheritance.
     * TS 4.0 doesn't allow properties to override accessors or vice-versa.
     * @docs-private
     */
    _setTemplateLabelInput(value) {
        // Only update the label if the query managed to find one. This works around an issue where a
        // user may have manually set `templateLabel` during creation mode, which would then get
        // clobbered by `undefined` when the query resolves. Also note that we check that the closest
        // tab matches the current one so that we don't pick up labels from nested tabs.
        if (value && value._closestTab === this) {
            this._templateLabel = value;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatTab, deps: [{ token: i0.ViewContainerRef }, { token: MAT_TAB_GROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.0.4", type: MatTab, isStandalone: true, selector: "mat-tab", inputs: { disabled: ["disabled", "disabled", booleanAttribute], textLabel: ["label", "textLabel"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], labelClass: "labelClass", bodyClass: "bodyClass" }, providers: [{ provide: MAT_TAB, useExisting: MatTab }], queries: [{ propertyName: "templateLabel", first: true, predicate: MatTabLabel, descendants: true }, { propertyName: "_explicitContent", first: true, predicate: MatTabContent, descendants: true, read: TemplateRef, static: true }], viewQueries: [{ propertyName: "_implicitContent", first: true, predicate: TemplateRef, descendants: true, static: true }], exportAs: ["matTab"], usesOnChanges: true, ngImport: i0, template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n", changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatTab, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, exportAs: 'matTab', providers: [{ provide: MAT_TAB, useExisting: MatTab }], standalone: true, template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n" }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TAB_GROUP]
                }, {
                    type: Optional
                }] }], propDecorators: { disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], templateLabel: [{
                type: ContentChild,
                args: [MatTabLabel]
            }], _explicitContent: [{
                type: ContentChild,
                args: [MatTabContent, { read: TemplateRef, static: true }]
            }], _implicitContent: [{
                type: ViewChild,
                args: [TemplateRef, { static: true }]
            }], textLabel: [{
                type: Input,
                args: ['label']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], labelClass: [{
                type: Input
            }], bodyClass: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLFFBQVEsRUFFUixXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBRTdCOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBTSxlQUFlLENBQUMsQ0FBQztBQWV0RSxNQUFNLE9BQU8sTUFBTTtJQUtqQix3RUFBd0U7SUFDeEUsSUFDSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFrQjtRQUNsQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQXdDRCxvQkFBb0I7SUFDcEIsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFzQkQsWUFDVSxpQkFBbUMsRUFDRCxnQkFBcUI7UUFEdkQsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBSztRQTlFakUsbUNBQW1DO1FBRW5DLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFZMUI7O1dBRUc7UUFHSyxxQkFBZ0IsR0FBcUIsU0FBVSxDQUFDO1FBS3hELDBFQUEwRTtRQUMxRCxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBdUJ2Qyx3REFBd0Q7UUFDaEQsbUJBQWMsR0FBMEIsSUFBSSxDQUFDO1FBT3JELDREQUE0RDtRQUNuRCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFN0M7OztXQUdHO1FBQ0gsYUFBUSxHQUFrQixJQUFJLENBQUM7UUFFL0I7OztXQUdHO1FBQ0gsV0FBTSxHQUFrQixJQUFJLENBQUM7UUFFN0I7O1dBRUc7UUFDSCxhQUFRLEdBQUcsS0FBSyxDQUFDO0lBS2QsQ0FBQztJQUVKLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDdEMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFDOUMsSUFBSSxDQUFDLGlCQUFpQixDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssc0JBQXNCLENBQUMsS0FBOEI7UUFDM0QsNkZBQTZGO1FBQzdGLHdGQUF3RjtRQUN4Riw2RkFBNkY7UUFDN0YsZ0ZBQWdGO1FBQ2hGLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs4R0FqSFUsTUFBTSxrREErRVAsYUFBYTtrR0EvRVosTUFBTSx3RkFFRSxnQkFBZ0Isb01BTHhCLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxxRUFTdEMsV0FBVyxtRkFZWCxhQUFhLDJCQUFTLFdBQVcsNkZBS3BDLFdBQVcseUdDekV4QiwrUUFJQTs7MkZEOENhLE1BQU07a0JBYmxCLFNBQVM7K0JBQ0UsU0FBUyxtQkFNRix1QkFBdUIsQ0FBQyxPQUFPLGlCQUNqQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCLFFBQVEsYUFDUCxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLFFBQVEsRUFBQyxDQUFDLGNBQ3hDLElBQUk7OzBCQWlGYixNQUFNOzJCQUFDLGFBQWE7OzBCQUFHLFFBQVE7eUNBNUVsQyxRQUFRO3NCQURQLEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBS2hDLGFBQWE7c0JBRGhCLFlBQVk7dUJBQUMsV0FBVztnQkFjakIsZ0JBQWdCO3NCQUZ2QixZQUFZO3VCQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztnQkFLdEIsZ0JBQWdCO3NCQUF2RCxTQUFTO3VCQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBR3RCLFNBQVM7c0JBQXhCLEtBQUs7dUJBQUMsT0FBTztnQkFHTyxTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBTU8sY0FBYztzQkFBdkMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBTWYsVUFBVTtzQkFBbEIsS0FBSztnQkFNRyxTQUFTO3NCQUFqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdFRhYkNvbnRlbnR9IGZyb20gJy4vdGFiLWNvbnRlbnQnO1xuaW1wb3J0IHtNQVRfVEFCLCBNYXRUYWJMYWJlbH0gZnJvbSAnLi90YWItbGFiZWwnO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIHRhYiBncm91cCB0byBhIHRhYiB3aXRob3V0IGNhdXNpbmcgYSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1RBQl9HUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNQVRfVEFCX0dST1VQJyk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWInLFxuICAvLyBOb3RlIHRoYXQgdXN1YWxseSB3ZSdkIGdvIHRocm91Z2ggYSBiaXQgbW9yZSB0cm91YmxlIGFuZCBzZXQgdXAgYW5vdGhlciBjbGFzcyBzbyB0aGF0XG4gIC8vIHRoZSBpbmxpbmVkIHRlbXBsYXRlIG9mIGBNYXRUYWJgIGlzbid0IGR1cGxpY2F0ZWQsIGhvd2V2ZXIgdGhlIHRlbXBsYXRlIGlzIHNtYWxsIGVub3VnaFxuICAvLyB0aGF0IGNyZWF0aW5nIHRoZSBleHRyYSBjbGFzcyB3aWxsIGdlbmVyYXRlIG1vcmUgY29kZSB0aGFuIGp1c3QgZHVwbGljYXRpbmcgdGhlIHRlbXBsYXRlLlxuICB0ZW1wbGF0ZVVybDogJ3RhYi5odG1sJyxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdFRhYicsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfVEFCLCB1c2VFeGlzdGluZzogTWF0VGFifV0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKiogd2hldGhlciB0aGUgdGFiIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIENvbnRlbnQgZm9yIHRoZSB0YWIgbGFiZWwgZ2l2ZW4gYnkgYDxuZy10ZW1wbGF0ZSBtYXQtdGFiLWxhYmVsPmAuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0VGFiTGFiZWwpXG4gIGdldCB0ZW1wbGF0ZUxhYmVsKCk6IE1hdFRhYkxhYmVsIHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVMYWJlbDtcbiAgfVxuICBzZXQgdGVtcGxhdGVMYWJlbCh2YWx1ZTogTWF0VGFiTGFiZWwpIHtcbiAgICB0aGlzLl9zZXRUZW1wbGF0ZUxhYmVsSW5wdXQodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3RlbXBsYXRlTGFiZWw6IE1hdFRhYkxhYmVsO1xuXG4gIC8qKlxuICAgKiBUZW1wbGF0ZSBwcm92aWRlZCBpbiB0aGUgdGFiIGNvbnRlbnQgdGhhdCB3aWxsIGJlIHVzZWQgaWYgcHJlc2VudCwgdXNlZCB0byBlbmFibGUgbGF6eS1sb2FkaW5nXG4gICAqL1xuICBAQ29udGVudENoaWxkKE1hdFRhYkNvbnRlbnQsIHtyZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlfSlcbiAgLy8gV2UgbmVlZCBhbiBpbml0aWFsaXplciBoZXJlIHRvIGF2b2lkIGEgVFMgZXJyb3IuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBpbiBgbmdBZnRlclZpZXdJbml0YC5cbiAgcHJpdmF0ZSBfZXhwbGljaXRDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+ID0gdW5kZWZpbmVkITtcblxuICAvKiogVGVtcGxhdGUgaW5zaWRlIHRoZSBNYXRUYWIgdmlldyB0aGF0IGNvbnRhaW5zIGFuIGA8bmctY29udGVudD5gLiAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgX2ltcGxpY2l0Q29udGVudDogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKiogUGxhaW4gdGV4dCBsYWJlbCBmb3IgdGhlIHRhYiwgdXNlZCB3aGVuIHRoZXJlIGlzIG5vIHRlbXBsYXRlIGxhYmVsLiAqL1xuICBASW5wdXQoJ2xhYmVsJykgdGV4dExhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKiogQXJpYSBsYWJlbCBmb3IgdGhlIHRhYi4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IHRoZSB0YWIgaXMgbGFiZWxsZWQgYnkuXG4gICAqIFdpbGwgYmUgY2xlYXJlZCBpZiBgYXJpYS1sYWJlbGAgaXMgc2V0IGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSB0YWIgbGFiZWwgaW5zaWRlIHRoZSBtYXQtdGFiLWhlYWRlciBjb250YWluZXIuXG4gICAqIFN1cHBvcnRzIHN0cmluZyBhbmQgc3RyaW5nIGFycmF5IHZhbHVlcywgc2FtZSBhcyBgbmdDbGFzc2AuXG4gICAqL1xuICBASW5wdXQoKSBsYWJlbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHRhYiBtYXQtdGFiLWJvZHkgY29udGFpbmVyLlxuICAgKiBTdXBwb3J0cyBzdHJpbmcgYW5kIHN0cmluZyBhcnJheSB2YWx1ZXMsIHNhbWUgYXMgYG5nQ2xhc3NgLlxuICAgKi9cbiAgQElucHV0KCkgYm9keUNsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogUG9ydGFsIHRoYXQgd2lsbCBiZSB0aGUgaG9zdGVkIGNvbnRlbnQgb2YgdGhlIHRhYiAqL1xuICBwcml2YXRlIF9jb250ZW50UG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGdldCBjb250ZW50KCk6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQb3J0YWw7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSB0YWIgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSByZWxhdGl2ZWx5IGluZGV4ZWQgcG9zaXRpb24gd2hlcmUgMCByZXByZXNlbnRzIHRoZSBjZW50ZXIsIG5lZ2F0aXZlIGlzIGxlZnQsIGFuZCBwb3NpdGl2ZVxuICAgKiByZXByZXNlbnRzIHRoZSByaWdodC5cbiAgICovXG4gIHBvc2l0aW9uOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogVGhlIGluaXRpYWwgcmVsYXRpdmVseSBpbmRleCBvcmlnaW4gb2YgdGhlIHRhYiBpZiBpdCB3YXMgY3JlYXRlZCBhbmQgc2VsZWN0ZWQgYWZ0ZXIgdGhlcmVcbiAgICogd2FzIGFscmVhZHkgYSBzZWxlY3RlZCB0YWIuIFByb3ZpZGVzIGNvbnRleHQgb2Ygd2hhdCBwb3NpdGlvbiB0aGUgdGFiIHNob3VsZCBvcmlnaW5hdGUgZnJvbS5cbiAgICovXG4gIG9yaWdpbjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHRhYiBpcyBjdXJyZW50bHkgYWN0aXZlLlxuICAgKi9cbiAgaXNBY3RpdmUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTUFUX1RBQl9HUk9VUCkgQE9wdGlvbmFsKCkgcHVibGljIF9jbG9zZXN0VGFiR3JvdXA6IGFueSxcbiAgKSB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgndGV4dExhYmVsJykgfHwgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZGlzYWJsZWQnKSkge1xuICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRlbnRQb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwoXG4gICAgICB0aGlzLl9leHBsaWNpdENvbnRlbnQgfHwgdGhpcy5faW1wbGljaXRDb250ZW50LFxuICAgICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaGFzIGJlZW4gZXh0cmFjdGVkIHRvIGEgdXRpbCBiZWNhdXNlIG9mIFRTIDQgYW5kIFZFLlxuICAgKiBWaWV3IEVuZ2luZSBkb2Vzbid0IHN1cHBvcnQgcHJvcGVydHkgcmVuYW1lIGluaGVyaXRhbmNlLlxuICAgKiBUUyA0LjAgZG9lc24ndCBhbGxvdyBwcm9wZXJ0aWVzIHRvIG92ZXJyaWRlIGFjY2Vzc29ycyBvciB2aWNlLXZlcnNhLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBwcml2YXRlIF9zZXRUZW1wbGF0ZUxhYmVsSW5wdXQodmFsdWU6IE1hdFRhYkxhYmVsIHwgdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSB1cGRhdGUgdGhlIGxhYmVsIGlmIHRoZSBxdWVyeSBtYW5hZ2VkIHRvIGZpbmQgb25lLiBUaGlzIHdvcmtzIGFyb3VuZCBhbiBpc3N1ZSB3aGVyZSBhXG4gICAgLy8gdXNlciBtYXkgaGF2ZSBtYW51YWxseSBzZXQgYHRlbXBsYXRlTGFiZWxgIGR1cmluZyBjcmVhdGlvbiBtb2RlLCB3aGljaCB3b3VsZCB0aGVuIGdldFxuICAgIC8vIGNsb2JiZXJlZCBieSBgdW5kZWZpbmVkYCB3aGVuIHRoZSBxdWVyeSByZXNvbHZlcy4gQWxzbyBub3RlIHRoYXQgd2UgY2hlY2sgdGhhdCB0aGUgY2xvc2VzdFxuICAgIC8vIHRhYiBtYXRjaGVzIHRoZSBjdXJyZW50IG9uZSBzbyB0aGF0IHdlIGRvbid0IHBpY2sgdXAgbGFiZWxzIGZyb20gbmVzdGVkIHRhYnMuXG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLl9jbG9zZXN0VGFiID09PSB0aGlzKSB7XG4gICAgICB0aGlzLl90ZW1wbGF0ZUxhYmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG59XG4iLCI8IS0tIENyZWF0ZSBhIHRlbXBsYXRlIGZvciB0aGUgY29udGVudCBvZiB0aGUgPG1hdC10YWI+IHNvIHRoYXQgd2UgY2FuIGdyYWIgYSByZWZlcmVuY2UgdG8gdGhpc1xuICAgIFRlbXBsYXRlUmVmIGFuZCB1c2UgaXQgaW4gYSBQb3J0YWwgdG8gcmVuZGVyIHRoZSB0YWIgY29udGVudCBpbiB0aGUgYXBwcm9wcmlhdGUgcGxhY2UgaW4gdGhlXG4gICAgdGFiLWdyb3VwLiAtLT5cbjxuZy10ZW1wbGF0ZT48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9uZy10ZW1wbGF0ZT5cbiJdfQ==