/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChildren, QueryList, ViewEncapsulation, } from '@angular/core';
import { MAT_LEGACY_OPTGROUP, MAT_LEGACY_OPTION_PARENT_COMPONENT, MatLegacyOption, } from '@angular/material/legacy-core';
import { _MatAutocompleteBase } from '@angular/material/autocomplete';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * @deprecated Use `MatAutocomplete` from `@angular/material/autocomplete` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyAutocomplete extends _MatAutocompleteBase {
    constructor() {
        super(...arguments);
        this._visibleClass = 'mat-autocomplete-visible';
        this._hiddenClass = 'mat-autocomplete-hidden';
    }
}
MatLegacyAutocomplete.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatLegacyAutocomplete, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatLegacyAutocomplete.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MatLegacyAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple" }, host: { classAttribute: "mat-autocomplete" }, providers: [{ provide: MAT_LEGACY_OPTION_PARENT_COMPONENT, useExisting: MatLegacyAutocomplete }], queries: [{ propertyName: "optionGroups", predicate: MAT_LEGACY_OPTGROUP, descendants: true }, { propertyName: "options", predicate: MatLegacyOption, descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatLegacyAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-autocomplete',
                    }, providers: [{ provide: MAT_LEGACY_OPTION_PARENT_COMPONENT, useExisting: MatLegacyAutocomplete }], template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}"] }]
        }], propDecorators: { optionGroups: [{
                type: ContentChildren,
                args: [MAT_LEGACY_OPTGROUP, { descendants: true }]
            }], options: [{
                type: ContentChildren,
                args: [MatLegacyOption, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1hdXRvY29tcGxldGUvYXV0b2NvbXBsZXRlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLG1CQUFtQixFQUNuQixrQ0FBa0MsRUFDbEMsZUFBZSxHQUVoQixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOzs7QUFFcEU7OztHQUdHO0FBY0gsTUFBTSxPQUFPLHFCQUFzQixTQUFRLG9CQUFvQjtJQWIvRDs7UUFtQlksa0JBQWEsR0FBRywwQkFBMEIsQ0FBQztRQUMzQyxpQkFBWSxHQUFHLHlCQUF5QixDQUFDO0tBQ3BEOzt1SEFSWSxxQkFBcUI7MkdBQXJCLHFCQUFxQixxSUFGckIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUMsQ0FBQyx1REFJN0UsbUJBQW1CLDZEQUduQixlQUFlLHNHQzdDbEMsZ1dBV0E7Z0dENkJhLHFCQUFxQjtrQkFiakMsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxpQkFBaUIsVUFDbkIsQ0FBQyxlQUFlLENBQUMsUUFDbkI7d0JBQ0osT0FBTyxFQUFFLGtCQUFrQjtxQkFDNUIsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLFdBQVcsdUJBQXVCLEVBQUMsQ0FBQzs4QkFLOUYsWUFBWTtzQkFEWCxlQUFlO3VCQUFDLG1CQUFtQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFHRixPQUFPO3NCQUE3RCxlQUFlO3VCQUFDLGVBQWUsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1BVF9MRUdBQ1lfT1BUR1JPVVAsXG4gIE1BVF9MRUdBQ1lfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsXG4gIE1hdExlZ2FjeU9wdGlvbixcbiAgTWF0TGVnYWN5T3B0Z3JvdXAsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1jb3JlJztcbmltcG9ydCB7X01hdEF1dG9jb21wbGV0ZUJhc2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2F1dG9jb21wbGV0ZSc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRBdXRvY29tcGxldGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2F1dG9jb21wbGV0ZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYXV0b2NvbXBsZXRlJyxcbiAgdGVtcGxhdGVVcmw6ICdhdXRvY29tcGxldGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydhdXRvY29tcGxldGUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZScsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWF1dG9jb21wbGV0ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfTEVHQUNZX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogTWF0TGVnYWN5QXV0b2NvbXBsZXRlfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUF1dG9jb21wbGV0ZSBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVCYXNlIHtcbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9uIGdyb3VwcyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfTEVHQUNZX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRMZWdhY3lPcHRncm91cD47XG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbnMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGVnYWN5T3B0aW9uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0TGVnYWN5T3B0aW9uPjtcbiAgcHJvdGVjdGVkIF92aXNpYmxlQ2xhc3MgPSAnbWF0LWF1dG9jb21wbGV0ZS12aXNpYmxlJztcbiAgcHJvdGVjdGVkIF9oaWRkZW5DbGFzcyA9ICdtYXQtYXV0b2NvbXBsZXRlLWhpZGRlbic7XG59XG4iLCI8bmctdGVtcGxhdGUgbGV0LWZvcm1GaWVsZElkPVwiaWRcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1hdXRvY29tcGxldGUtcGFuZWxcIlxuICAgICAgIHJvbGU9XCJsaXN0Ym94XCJcbiAgICAgICBbaWRdPVwiaWRcIlxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieShmb3JtRmllbGRJZClcIlxuICAgICAgIFtuZ0NsYXNzXT1cIl9jbGFzc0xpc3RcIlxuICAgICAgICNwYW5lbD5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==