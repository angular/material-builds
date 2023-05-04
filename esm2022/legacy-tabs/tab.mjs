/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { _MatTabBase, MAT_TAB, MatTabLabel, MAT_TAB_LABEL, MAT_TAB_CONTENT, } from '@angular/material/tabs';
import * as i0 from "@angular/core";
/**
 * @deprecated Use `MatTab` from `@angular/material/tabs` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTab extends _MatTabBase {
    constructor() {
        super(...arguments);
        /**
         * Template provided in the tab content that will be used if present, used to enable lazy-loading
         */
        this._explicitContent = undefined;
    }
    /** Content for the tab label given by `<ng-template mat-tab-label>`. */
    get templateLabel() {
        return this._templateLabel;
    }
    set templateLabel(value) {
        this._setTemplateLabelInput(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTab, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyTab, selector: "mat-tab", inputs: { disabled: "disabled" }, providers: [{ provide: MAT_TAB, useExisting: MatLegacyTab }], queries: [{ propertyName: "templateLabel", first: true, predicate: MAT_TAB_LABEL, descendants: true }, { propertyName: "_explicitContent", first: true, predicate: MAT_TAB_CONTENT, descendants: true, read: TemplateRef, static: true }], exportAs: ["matTab"], usesInheritance: true, ngImport: i0, template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n", changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyTab };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyTab, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab', inputs: ['disabled'], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, exportAs: 'matTab', providers: [{ provide: MAT_TAB, useExisting: MatLegacyTab }], template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n" }]
        }], propDecorators: { templateLabel: [{
                type: ContentChild,
                args: [MAT_TAB_LABEL]
            }], _explicitContent: [{
                type: ContentChild,
                args: [MAT_TAB_CONTENT, { read: TemplateRef, static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS10YWJzL3RhYi50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktdGFicy90YWIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNYLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsV0FBVyxFQUNYLE9BQU8sRUFDUCxXQUFXLEVBQ1gsYUFBYSxFQUNiLGVBQWUsR0FDaEIsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFaEM7OztHQUdHO0FBQ0gsTUFVYSxZQUFhLFNBQVEsV0FBVztJQVY3Qzs7UUFvQkU7O1dBRUc7UUFHTSxxQkFBZ0IsR0FBcUIsU0FBVSxDQUFDO0tBQzFEO0lBZkMsd0VBQXdFO0lBQ3hFLElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsS0FBa0I7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7OEdBUlUsWUFBWTtrR0FBWixZQUFZLG9FQUZaLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUMsQ0FBQyxxRUFJNUMsYUFBYSxtRkFXYixlQUFlLDJCQUFTLFdBQVcsd0ZDbERuRCwrUUFJQTs7U0RpQ2EsWUFBWTsyRkFBWixZQUFZO2tCQVZ4QixTQUFTOytCQUNFLFNBQVMsVUFFWCxDQUFDLFVBQVUsQ0FBQyxtQkFFSCx1QkFBdUIsQ0FBQyxPQUFPLGlCQUNqQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCLFFBQVEsYUFDUCxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLGNBQWMsRUFBQyxDQUFDOzhCQUt0RCxhQUFhO3NCQURoQixZQUFZO3VCQUFDLGFBQWE7Z0JBYWxCLGdCQUFnQjtzQkFGeEIsWUFBWTt1QkFBQyxlQUFlLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgX01hdFRhYkJhc2UsXG4gIE1BVF9UQUIsXG4gIE1hdFRhYkxhYmVsLFxuICBNQVRfVEFCX0xBQkVMLFxuICBNQVRfVEFCX0NPTlRFTlQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0VGFiYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC90YWJzYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWInLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi5odG1sJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRUYWInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1RBQiwgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeVRhYn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUYWIgZXh0ZW5kcyBfTWF0VGFiQmFzZSB7XG4gIC8qKiBDb250ZW50IGZvciB0aGUgdGFiIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1BVF9UQUJfTEFCRUwpXG4gIGdldCB0ZW1wbGF0ZUxhYmVsKCk6IE1hdFRhYkxhYmVsIHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVMYWJlbDtcbiAgfVxuICBzZXQgdGVtcGxhdGVMYWJlbCh2YWx1ZTogTWF0VGFiTGFiZWwpIHtcbiAgICB0aGlzLl9zZXRUZW1wbGF0ZUxhYmVsSW5wdXQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlbXBsYXRlIHByb3ZpZGVkIGluIHRoZSB0YWIgY29udGVudCB0aGF0IHdpbGwgYmUgdXNlZCBpZiBwcmVzZW50LCB1c2VkIHRvIGVuYWJsZSBsYXp5LWxvYWRpbmdcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX1RBQl9DT05URU5ULCB7cmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZX0pXG4gIC8vIFdlIG5lZWQgYW4gaW5pdGlhbGl6ZXIgaGVyZSB0byBhdm9pZCBhIFRTIGVycm9yLiBUaGUgdmFsdWUgd2lsbCBiZSBzZXQgaW4gYG5nQWZ0ZXJWaWV3SW5pdGAuXG4gIG92ZXJyaWRlIF9leHBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT4gPSB1bmRlZmluZWQhO1xufVxuIiwiPCEtLSBDcmVhdGUgYSB0ZW1wbGF0ZSBmb3IgdGhlIGNvbnRlbnQgb2YgdGhlIDxtYXQtdGFiPiBzbyB0aGF0IHdlIGNhbiBncmFiIGEgcmVmZXJlbmNlIHRvIHRoaXNcbiAgICBUZW1wbGF0ZVJlZiBhbmQgdXNlIGl0IGluIGEgUG9ydGFsIHRvIHJlbmRlciB0aGUgdGFiIGNvbnRlbnQgaW4gdGhlIGFwcHJvcHJpYXRlIHBsYWNlIGluIHRoZVxuICAgIHRhYi1ncm91cC4gLS0+XG48bmctdGVtcGxhdGU+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvbmctdGVtcGxhdGU+XG4iXX0=