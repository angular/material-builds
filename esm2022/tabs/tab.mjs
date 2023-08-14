/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, Inject, InjectionToken, Input, Optional, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { MatTabContent } from './tab-content';
import { MAT_TAB, MatTabLabel } from './tab-label';
import { mixinDisabled } from '@angular/material/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
// Boilerplate for applying mixins to MatTab.
/** @docs-private */
const _MatTabMixinBase = mixinDisabled(class {
});
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB_GROUP = new InjectionToken('MAT_TAB_GROUP');
export class MatTab extends _MatTabMixinBase {
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
        super();
        this._viewContainerRef = _viewContainerRef;
        this._closestTabGroup = _closestTabGroup;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatTab, deps: [{ token: i0.ViewContainerRef }, { token: MAT_TAB_GROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatTab, selector: "mat-tab", inputs: { disabled: "disabled", textLabel: ["label", "textLabel"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], labelClass: "labelClass", bodyClass: "bodyClass" }, providers: [{ provide: MAT_TAB, useExisting: MatTab }], queries: [{ propertyName: "templateLabel", first: true, predicate: MatTabLabel, descendants: true }, { propertyName: "_explicitContent", first: true, predicate: MatTabContent, descendants: true, read: TemplateRef, static: true }], viewQueries: [{ propertyName: "_implicitContent", first: true, predicate: TemplateRef, descendants: true, static: true }], exportAs: ["matTab"], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n", changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatTab, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab', inputs: ['disabled'], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, exportAs: 'matTab', providers: [{ provide: MAT_TAB, useExisting: MatTab }], template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TAB_GROUP]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { templateLabel: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLFFBQVEsRUFFUixXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqRCxPQUFPLEVBQWEsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBRTdCLDZDQUE2QztBQUM3QyxvQkFBb0I7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFFakQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUFNLGVBQWUsQ0FBQyxDQUFDO0FBZ0J0RSxNQUFNLE9BQU8sTUFBTyxTQUFRLGdCQUFnQjtJQUcxQyxJQUNJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUNELElBQUksYUFBYSxDQUFDLEtBQWtCO1FBQ2xDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBdUNELG9CQUFvQjtJQUNwQixJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQXNCRCxZQUNVLGlCQUFtQyxFQUNELGdCQUFxQjtRQUUvRCxLQUFLLEVBQUUsQ0FBQztRQUhBLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUs7UUFoRWpFOztXQUVHO1FBR0sscUJBQWdCLEdBQXFCLFNBQVUsQ0FBQztRQUt4RCwwRUFBMEU7UUFDMUQsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQXVCdkMsd0RBQXdEO1FBQ2hELG1CQUFjLEdBQTBCLElBQUksQ0FBQztRQU9yRCw0REFBNEQ7UUFDbkQsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRTdDOzs7V0FHRztRQUNILGFBQVEsR0FBa0IsSUFBSSxDQUFDO1FBRS9COzs7V0FHRztRQUNILFdBQU0sR0FBa0IsSUFBSSxDQUFDO1FBRTdCOztXQUVHO1FBQ0gsYUFBUSxHQUFHLEtBQUssQ0FBQztJQU9qQixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUN0QyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUM5QyxJQUFJLENBQUMsaUJBQWlCLENBQ3ZCLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxzQkFBc0IsQ0FBQyxLQUE4QjtRQUMzRCw2RkFBNkY7UUFDN0Ysd0ZBQXdGO1FBQ3hGLDZGQUE2RjtRQUM3RixnRkFBZ0Y7UUFDaEYsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7U0FDN0I7SUFDSCxDQUFDOzhHQS9HVSxNQUFNLGtEQTJFUCxhQUFhO2tHQTNFWixNQUFNLHdQQUZOLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxxRUFLdEMsV0FBVyxtRkFXWCxhQUFhLDJCQUFTLFdBQVcsNkZBS3BDLFdBQVcsZ0lDMUV4QiwrUUFJQTs7MkZEbURhLE1BQU07a0JBZGxCLFNBQVM7K0JBQ0UsU0FBUyxVQU1YLENBQUMsVUFBVSxDQUFDLG1CQUVILHVCQUF1QixDQUFDLE9BQU8saUJBQ2pDLGlCQUFpQixDQUFDLElBQUksWUFDM0IsUUFBUSxhQUNQLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsUUFBUSxFQUFDLENBQUM7OzBCQTZFakQsTUFBTTsyQkFBQyxhQUFhOzswQkFBRyxRQUFROzRDQXZFOUIsYUFBYTtzQkFEaEIsWUFBWTt1QkFBQyxXQUFXO2dCQWFqQixnQkFBZ0I7c0JBRnZCLFlBQVk7dUJBQUMsYUFBYSxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUt0QixnQkFBZ0I7c0JBQXZELFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFHdEIsU0FBUztzQkFBeEIsS0FBSzt1QkFBQyxPQUFPO2dCQUdPLFNBQVM7c0JBQTdCLEtBQUs7dUJBQUMsWUFBWTtnQkFNTyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFNZixVQUFVO3NCQUFsQixLQUFLO2dCQU1HLFNBQVM7c0JBQWpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0VGFiQ29udGVudH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01BVF9UQUIsIE1hdFRhYkxhYmVsfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5pbXBvcnQge0NhbkRpc2FibGUsIG1peGluRGlzYWJsZWR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0VGFiTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlZChjbGFzcyB7fSk7XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgdGFiIGdyb3VwIHRvIGEgdGFiIHdpdGhvdXQgY2F1c2luZyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVEFCX0dST1VQID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01BVF9UQUJfR1JPVVAnKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYicsXG5cbiAgLy8gTm90ZSB0aGF0IHVzdWFsbHkgd2UnZCBnbyB0aHJvdWdoIGEgYml0IG1vcmUgdHJvdWJsZSBhbmQgc2V0IHVwIGFub3RoZXIgY2xhc3Mgc28gdGhhdFxuICAvLyB0aGUgaW5saW5lZCB0ZW1wbGF0ZSBvZiBgTWF0VGFiYCBpc24ndCBkdXBsaWNhdGVkLCBob3dldmVyIHRoZSB0ZW1wbGF0ZSBpcyBzbWFsbCBlbm91Z2hcbiAgLy8gdGhhdCBjcmVhdGluZyB0aGUgZXh0cmEgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBtb3JlIGNvZGUgdGhhbiBqdXN0IGR1cGxpY2F0aW5nIHRoZSB0ZW1wbGF0ZS5cbiAgdGVtcGxhdGVVcmw6ICd0YWIuaHRtbCcsXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0VGFiJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9UQUIsIHVzZUV4aXN0aW5nOiBNYXRUYWJ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiIGV4dGVuZHMgX01hdFRhYk1peGluQmFzZSBpbXBsZW1lbnRzIENhbkRpc2FibGUsIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKiogQ29udGVudCBmb3IgdGhlIHRhYiBsYWJlbCBnaXZlbiBieSBgPG5nLXRlbXBsYXRlIG1hdC10YWItbGFiZWw+YC4gKi9cbiAgcHJpdmF0ZSBfdGVtcGxhdGVMYWJlbDogTWF0VGFiTGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0VGFiTGFiZWwpXG4gIGdldCB0ZW1wbGF0ZUxhYmVsKCk6IE1hdFRhYkxhYmVsIHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVMYWJlbDtcbiAgfVxuICBzZXQgdGVtcGxhdGVMYWJlbCh2YWx1ZTogTWF0VGFiTGFiZWwpIHtcbiAgICB0aGlzLl9zZXRUZW1wbGF0ZUxhYmVsSW5wdXQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlbXBsYXRlIHByb3ZpZGVkIGluIHRoZSB0YWIgY29udGVudCB0aGF0IHdpbGwgYmUgdXNlZCBpZiBwcmVzZW50LCB1c2VkIHRvIGVuYWJsZSBsYXp5LWxvYWRpbmdcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTWF0VGFiQ29udGVudCwge3JlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWV9KVxuICAvLyBXZSBuZWVkIGFuIGluaXRpYWxpemVyIGhlcmUgdG8gYXZvaWQgYSBUUyBlcnJvci4gVGhlIHZhbHVlIHdpbGwgYmUgc2V0IGluIGBuZ0FmdGVyVmlld0luaXRgLlxuICBwcml2YXRlIF9leHBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT4gPSB1bmRlZmluZWQhO1xuXG4gIC8qKiBUZW1wbGF0ZSBpbnNpZGUgdGhlIE1hdFRhYiB2aWV3IHRoYXQgY29udGFpbnMgYW4gYDxuZy1jb250ZW50PmAuICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSBfaW1wbGljaXRDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBQbGFpbiB0ZXh0IGxhYmVsIGZvciB0aGUgdGFiLCB1c2VkIHdoZW4gdGhlcmUgaXMgbm8gdGVtcGxhdGUgbGFiZWwuICovXG4gIEBJbnB1dCgnbGFiZWwnKSB0ZXh0TGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBBcmlhIGxhYmVsIGZvciB0aGUgdGFiLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgdGhlIHRhYiBpcyBsYWJlbGxlZCBieS5cbiAgICogV2lsbCBiZSBjbGVhcmVkIGlmIGBhcmlhLWxhYmVsYCBpcyBzZXQgYXQgdGhlIHNhbWUgdGltZS5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKipcbiAgICogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHRhYiBsYWJlbCBpbnNpZGUgdGhlIG1hdC10YWItaGVhZGVyIGNvbnRhaW5lci5cbiAgICogU3VwcG9ydHMgc3RyaW5nIGFuZCBzdHJpbmcgYXJyYXkgdmFsdWVzLCBzYW1lIGFzIGBuZ0NsYXNzYC5cbiAgICovXG4gIEBJbnB1dCgpIGxhYmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgdGFiIG1hdC10YWItYm9keSBjb250YWluZXIuXG4gICAqIFN1cHBvcnRzIHN0cmluZyBhbmQgc3RyaW5nIGFycmF5IHZhbHVlcywgc2FtZSBhcyBgbmdDbGFzc2AuXG4gICAqL1xuICBASW5wdXQoKSBib2R5Q2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKiBQb3J0YWwgdGhhdCB3aWxsIGJlIHRoZSBob3N0ZWQgY29udGVudCBvZiB0aGUgdGFiICovXG4gIHByaXZhdGUgX2NvbnRlbnRQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGNvbnRlbnQoKTogVGVtcGxhdGVQb3J0YWwgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudFBvcnRhbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIHRhYiBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHJlbGF0aXZlbHkgaW5kZXhlZCBwb3NpdGlvbiB3aGVyZSAwIHJlcHJlc2VudHMgdGhlIGNlbnRlciwgbmVnYXRpdmUgaXMgbGVmdCwgYW5kIHBvc2l0aXZlXG4gICAqIHJlcHJlc2VudHMgdGhlIHJpZ2h0LlxuICAgKi9cbiAgcG9zaXRpb246IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5pdGlhbCByZWxhdGl2ZWx5IGluZGV4IG9yaWdpbiBvZiB0aGUgdGFiIGlmIGl0IHdhcyBjcmVhdGVkIGFuZCBzZWxlY3RlZCBhZnRlciB0aGVyZVxuICAgKiB3YXMgYWxyZWFkeSBhIHNlbGVjdGVkIHRhYi4gUHJvdmlkZXMgY29udGV4dCBvZiB3aGF0IHBvc2l0aW9uIHRoZSB0YWIgc2hvdWxkIG9yaWdpbmF0ZSBmcm9tLlxuICAgKi9cbiAgb3JpZ2luOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdGFiIGlzIGN1cnJlbnRseSBhY3RpdmUuXG4gICAqL1xuICBpc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChNQVRfVEFCX0dST1VQKSBAT3B0aW9uYWwoKSBwdWJsaWMgX2Nsb3Nlc3RUYWJHcm91cDogYW55LFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCd0ZXh0TGFiZWwnKSB8fCBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdkaXNhYmxlZCcpKSB7XG4gICAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29udGVudFBvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbChcbiAgICAgIHRoaXMuX2V4cGxpY2l0Q29udGVudCB8fCB0aGlzLl9pbXBsaWNpdENvbnRlbnQsXG4gICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBoYXMgYmVlbiBleHRyYWN0ZWQgdG8gYSB1dGlsIGJlY2F1c2Ugb2YgVFMgNCBhbmQgVkUuXG4gICAqIFZpZXcgRW5naW5lIGRvZXNuJ3Qgc3VwcG9ydCBwcm9wZXJ0eSByZW5hbWUgaW5oZXJpdGFuY2UuXG4gICAqIFRTIDQuMCBkb2Vzbid0IGFsbG93IHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgYWNjZXNzb3JzIG9yIHZpY2UtdmVyc2EuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgX3NldFRlbXBsYXRlTGFiZWxJbnB1dCh2YWx1ZTogTWF0VGFiTGFiZWwgfCB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgbGFiZWwgaWYgdGhlIHF1ZXJ5IG1hbmFnZWQgdG8gZmluZCBvbmUuIFRoaXMgd29ya3MgYXJvdW5kIGFuIGlzc3VlIHdoZXJlIGFcbiAgICAvLyB1c2VyIG1heSBoYXZlIG1hbnVhbGx5IHNldCBgdGVtcGxhdGVMYWJlbGAgZHVyaW5nIGNyZWF0aW9uIG1vZGUsIHdoaWNoIHdvdWxkIHRoZW4gZ2V0XG4gICAgLy8gY2xvYmJlcmVkIGJ5IGB1bmRlZmluZWRgIHdoZW4gdGhlIHF1ZXJ5IHJlc29sdmVzLiBBbHNvIG5vdGUgdGhhdCB3ZSBjaGVjayB0aGF0IHRoZSBjbG9zZXN0XG4gICAgLy8gdGFiIG1hdGNoZXMgdGhlIGN1cnJlbnQgb25lIHNvIHRoYXQgd2UgZG9uJ3QgcGljayB1cCBsYWJlbHMgZnJvbSBuZXN0ZWQgdGFicy5cbiAgICBpZiAodmFsdWUgJiYgdmFsdWUuX2Nsb3Nlc3RUYWIgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlTGFiZWwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cbn1cbiIsIjwhLS0gQ3JlYXRlIGEgdGVtcGxhdGUgZm9yIHRoZSBjb250ZW50IG9mIHRoZSA8bWF0LXRhYj4gc28gdGhhdCB3ZSBjYW4gZ3JhYiBhIHJlZmVyZW5jZSB0byB0aGlzXG4gICAgVGVtcGxhdGVSZWYgYW5kIHVzZSBpdCBpbiBhIFBvcnRhbCB0byByZW5kZXIgdGhlIHRhYiBjb250ZW50IGluIHRoZSBhcHByb3ByaWF0ZSBwbGFjZSBpbiB0aGVcbiAgICB0YWItZ3JvdXAuIC0tPlxuPG5nLXRlbXBsYXRlPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L25nLXRlbXBsYXRlPlxuIl19