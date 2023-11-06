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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatTab, deps: [{ token: i0.ViewContainerRef }, { token: MAT_TAB_GROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.0.0-rc.2", type: MatTab, selector: "mat-tab", inputs: { disabled: ["disabled", "disabled", booleanAttribute], textLabel: ["label", "textLabel"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], labelClass: "labelClass", bodyClass: "bodyClass" }, providers: [{ provide: MAT_TAB, useExisting: MatTab }], queries: [{ propertyName: "templateLabel", first: true, predicate: MatTabLabel, descendants: true }, { propertyName: "_explicitContent", first: true, predicate: MatTabContent, descendants: true, read: TemplateRef, static: true }], viewQueries: [{ propertyName: "_implicitContent", first: true, predicate: TemplateRef, descendants: true, static: true }], exportAs: ["matTab"], usesOnChanges: true, ngImport: i0, template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n", changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatTab, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, exportAs: 'matTab', providers: [{ provide: MAT_TAB, useExisting: MatTab }], template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLFFBQVEsRUFFUixXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBRTdCOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBTSxlQUFlLENBQUMsQ0FBQztBQWV0RSxNQUFNLE9BQU8sTUFBTTtJQUtqQix3RUFBd0U7SUFDeEUsSUFDSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFrQjtRQUNsQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQXdDRCxvQkFBb0I7SUFDcEIsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFzQkQsWUFDVSxpQkFBbUMsRUFDRCxnQkFBcUI7UUFEdkQsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBSztRQTlFakUsbUNBQW1DO1FBRW5DLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFZMUI7O1dBRUc7UUFHSyxxQkFBZ0IsR0FBcUIsU0FBVSxDQUFDO1FBS3hELDBFQUEwRTtRQUMxRCxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBdUJ2Qyx3REFBd0Q7UUFDaEQsbUJBQWMsR0FBMEIsSUFBSSxDQUFDO1FBT3JELDREQUE0RDtRQUNuRCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFN0M7OztXQUdHO1FBQ0gsYUFBUSxHQUFrQixJQUFJLENBQUM7UUFFL0I7OztXQUdHO1FBQ0gsV0FBTSxHQUFrQixJQUFJLENBQUM7UUFFN0I7O1dBRUc7UUFDSCxhQUFRLEdBQUcsS0FBSyxDQUFDO0lBS2QsQ0FBQztJQUVKLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDdEMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFDOUMsSUFBSSxDQUFDLGlCQUFpQixDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssc0JBQXNCLENBQUMsS0FBOEI7UUFDM0QsNkZBQTZGO1FBQzdGLHdGQUF3RjtRQUN4Riw2RkFBNkY7UUFDN0YsZ0ZBQWdGO1FBQ2hGLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzttSEFqSFUsTUFBTSxrREErRVAsYUFBYTt1R0EvRVosTUFBTSxvRUFFRSxnQkFBZ0Isb01BSnhCLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxxRUFRdEMsV0FBVyxtRkFZWCxhQUFhLDJCQUFTLFdBQVcsNkZBS3BDLFdBQVcseUdDekV4QiwrUUFJQTs7Z0dEOENhLE1BQU07a0JBYmxCLFNBQVM7K0JBQ0UsU0FBUyxtQkFPRix1QkFBdUIsQ0FBQyxPQUFPLGlCQUNqQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCLFFBQVEsYUFDUCxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLFFBQVEsRUFBQyxDQUFDOzswQkFpRmpELE1BQU07MkJBQUMsYUFBYTs7MEJBQUcsUUFBUTt5Q0E1RWxDLFFBQVE7c0JBRFAsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFLaEMsYUFBYTtzQkFEaEIsWUFBWTt1QkFBQyxXQUFXO2dCQWNqQixnQkFBZ0I7c0JBRnZCLFlBQVk7dUJBQUMsYUFBYSxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUt0QixnQkFBZ0I7c0JBQXZELFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFHdEIsU0FBUztzQkFBeEIsS0FBSzt1QkFBQyxPQUFPO2dCQUdPLFNBQVM7c0JBQTdCLEtBQUs7dUJBQUMsWUFBWTtnQkFNTyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFNZixVQUFVO3NCQUFsQixLQUFLO2dCQU1HLFNBQVM7c0JBQWpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0VGFiQ29udGVudH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01BVF9UQUIsIE1hdFRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgdGFiIGdyb3VwIHRvIGEgdGFiIHdpdGhvdXQgY2F1c2luZyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVEFCX0dST1VQID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01BVF9UQUJfR1JPVVAnKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYicsXG5cbiAgLy8gTm90ZSB0aGF0IHVzdWFsbHkgd2UnZCBnbyB0aHJvdWdoIGEgYml0IG1vcmUgdHJvdWJsZSBhbmQgc2V0IHVwIGFub3RoZXIgY2xhc3Mgc28gdGhhdFxuICAvLyB0aGUgaW5saW5lZCB0ZW1wbGF0ZSBvZiBgTWF0VGFiYCBpc24ndCBkdXBsaWNhdGVkLCBob3dldmVyIHRoZSB0ZW1wbGF0ZSBpcyBzbWFsbCBlbm91Z2hcbiAgLy8gdGhhdCBjcmVhdGluZyB0aGUgZXh0cmEgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBtb3JlIGNvZGUgdGhhbiBqdXN0IGR1cGxpY2F0aW5nIHRoZSB0ZW1wbGF0ZS5cbiAgdGVtcGxhdGVVcmw6ICd0YWIuaHRtbCcsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRUYWInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1RBQiwgdXNlRXhpc3Rpbmc6IE1hdFRhYn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqIHdoZXRoZXIgdGhlIHRhYiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBDb250ZW50IGZvciB0aGUgdGFiIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1hdFRhYkxhYmVsKVxuICBnZXQgdGVtcGxhdGVMYWJlbCgpOiBNYXRUYWJMYWJlbCB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlTGFiZWw7XG4gIH1cbiAgc2V0IHRlbXBsYXRlTGFiZWwodmFsdWU6IE1hdFRhYkxhYmVsKSB7XG4gICAgdGhpcy5fc2V0VGVtcGxhdGVMYWJlbElucHV0KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90ZW1wbGF0ZUxhYmVsOiBNYXRUYWJMYWJlbDtcblxuICAvKipcbiAgICogVGVtcGxhdGUgcHJvdmlkZWQgaW4gdGhlIHRhYiBjb250ZW50IHRoYXQgd2lsbCBiZSB1c2VkIGlmIHByZXNlbnQsIHVzZWQgdG8gZW5hYmxlIGxhenktbG9hZGluZ1xuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNYXRUYWJDb250ZW50LCB7cmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZX0pXG4gIC8vIFdlIG5lZWQgYW4gaW5pdGlhbGl6ZXIgaGVyZSB0byBhdm9pZCBhIFRTIGVycm9yLiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgaW4gYG5nQWZ0ZXJWaWV3SW5pdGAuXG4gIHByaXZhdGUgX2V4cGxpY2l0Q29udGVudDogVGVtcGxhdGVSZWY8YW55PiA9IHVuZGVmaW5lZCE7XG5cbiAgLyoqIFRlbXBsYXRlIGluc2lkZSB0aGUgTWF0VGFiIHZpZXcgdGhhdCBjb250YWlucyBhbiBgPG5nLWNvbnRlbnQ+YC4gKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIF9pbXBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFBsYWluIHRleHQgbGFiZWwgZm9yIHRoZSB0YWIsIHVzZWQgd2hlbiB0aGVyZSBpcyBubyB0ZW1wbGF0ZSBsYWJlbC4gKi9cbiAgQElucHV0KCdsYWJlbCcpIHRleHRMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEFyaWEgbGFiZWwgZm9yIHRoZSB0YWIuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCB0aGUgdGFiIGlzIGxhYmVsbGVkIGJ5LlxuICAgKiBXaWxsIGJlIGNsZWFyZWQgaWYgYGFyaWEtbGFiZWxgIGlzIHNldCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgdGFiIGxhYmVsIGluc2lkZSB0aGUgbWF0LXRhYi1oZWFkZXIgY29udGFpbmVyLlxuICAgKiBTdXBwb3J0cyBzdHJpbmcgYW5kIHN0cmluZyBhcnJheSB2YWx1ZXMsIHNhbWUgYXMgYG5nQ2xhc3NgLlxuICAgKi9cbiAgQElucHV0KCkgbGFiZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSB0YWIgbWF0LXRhYi1ib2R5IGNvbnRhaW5lci5cbiAgICogU3VwcG9ydHMgc3RyaW5nIGFuZCBzdHJpbmcgYXJyYXkgdmFsdWVzLCBzYW1lIGFzIGBuZ0NsYXNzYC5cbiAgICovXG4gIEBJbnB1dCgpIGJvZHlDbGFzczogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFBvcnRhbCB0aGF0IHdpbGwgYmUgdGhlIGhvc3RlZCBjb250ZW50IG9mIHRoZSB0YWIgKi9cbiAgcHJpdmF0ZSBfY29udGVudFBvcnRhbDogVGVtcGxhdGVQb3J0YWwgfCBudWxsID0gbnVsbDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgY29udGVudCgpOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50UG9ydGFsO1xuICB9XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgdGFiIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVsYXRpdmVseSBpbmRleGVkIHBvc2l0aW9uIHdoZXJlIDAgcmVwcmVzZW50cyB0aGUgY2VudGVyLCBuZWdhdGl2ZSBpcyBsZWZ0LCBhbmQgcG9zaXRpdmVcbiAgICogcmVwcmVzZW50cyB0aGUgcmlnaHQuXG4gICAqL1xuICBwb3NpdGlvbjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBpbml0aWFsIHJlbGF0aXZlbHkgaW5kZXggb3JpZ2luIG9mIHRoZSB0YWIgaWYgaXQgd2FzIGNyZWF0ZWQgYW5kIHNlbGVjdGVkIGFmdGVyIHRoZXJlXG4gICAqIHdhcyBhbHJlYWR5IGEgc2VsZWN0ZWQgdGFiLiBQcm92aWRlcyBjb250ZXh0IG9mIHdoYXQgcG9zaXRpb24gdGhlIHRhYiBzaG91bGQgb3JpZ2luYXRlIGZyb20uXG4gICAqL1xuICBvcmlnaW46IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB0YWIgaXMgY3VycmVudGx5IGFjdGl2ZS5cbiAgICovXG4gIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1BVF9UQUJfR1JPVVApIEBPcHRpb25hbCgpIHB1YmxpYyBfY2xvc2VzdFRhYkdyb3VwOiBhbnksXG4gICkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RleHRMYWJlbCcpIHx8IGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZW50UG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKFxuICAgICAgdGhpcy5fZXhwbGljaXRDb250ZW50IHx8IHRoaXMuX2ltcGxpY2l0Q29udGVudCxcbiAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGhhcyBiZWVuIGV4dHJhY3RlZCB0byBhIHV0aWwgYmVjYXVzZSBvZiBUUyA0IGFuZCBWRS5cbiAgICogVmlldyBFbmdpbmUgZG9lc24ndCBzdXBwb3J0IHByb3BlcnR5IHJlbmFtZSBpbmhlcml0YW5jZS5cbiAgICogVFMgNC4wIGRvZXNuJ3QgYWxsb3cgcHJvcGVydGllcyB0byBvdmVycmlkZSBhY2Nlc3NvcnMgb3IgdmljZS12ZXJzYS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0VGVtcGxhdGVMYWJlbElucHV0KHZhbHVlOiBNYXRUYWJMYWJlbCB8IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBsYWJlbCBpZiB0aGUgcXVlcnkgbWFuYWdlZCB0byBmaW5kIG9uZS4gVGhpcyB3b3JrcyBhcm91bmQgYW4gaXNzdWUgd2hlcmUgYVxuICAgIC8vIHVzZXIgbWF5IGhhdmUgbWFudWFsbHkgc2V0IGB0ZW1wbGF0ZUxhYmVsYCBkdXJpbmcgY3JlYXRpb24gbW9kZSwgd2hpY2ggd291bGQgdGhlbiBnZXRcbiAgICAvLyBjbG9iYmVyZWQgYnkgYHVuZGVmaW5lZGAgd2hlbiB0aGUgcXVlcnkgcmVzb2x2ZXMuIEFsc28gbm90ZSB0aGF0IHdlIGNoZWNrIHRoYXQgdGhlIGNsb3Nlc3RcbiAgICAvLyB0YWIgbWF0Y2hlcyB0aGUgY3VycmVudCBvbmUgc28gdGhhdCB3ZSBkb24ndCBwaWNrIHVwIGxhYmVscyBmcm9tIG5lc3RlZCB0YWJzLlxuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5fY2xvc2VzdFRhYiA9PT0gdGhpcykge1xuICAgICAgdGhpcy5fdGVtcGxhdGVMYWJlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxufVxuIiwiPCEtLSBDcmVhdGUgYSB0ZW1wbGF0ZSBmb3IgdGhlIGNvbnRlbnQgb2YgdGhlIDxtYXQtdGFiPiBzbyB0aGF0IHdlIGNhbiBncmFiIGEgcmVmZXJlbmNlIHRvIHRoaXNcbiAgICBUZW1wbGF0ZVJlZiBhbmQgdXNlIGl0IGluIGEgUG9ydGFsIHRvIHJlbmRlciB0aGUgdGFiIGNvbnRlbnQgaW4gdGhlIGFwcHJvcHJpYXRlIHBsYWNlIGluIHRoZVxuICAgIHRhYi1ncm91cC4gLS0+XG48bmctdGVtcGxhdGU+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvbmctdGVtcGxhdGU+XG4iXX0=