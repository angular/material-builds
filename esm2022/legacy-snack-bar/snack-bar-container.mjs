/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { _MatSnackBarContainerBase, matSnackBarAnimations } from '@angular/material/snack-bar';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/portal";
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 * @deprecated Use `MatSnackBarContainer` from `@angular/material/snack-bar` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacySnackBarContainer extends _MatSnackBarContainerBase {
    _afterPortalAttached() {
        super._afterPortalAttached();
        if (this.snackBarConfig.horizontalPosition === 'center') {
            this._elementRef.nativeElement.classList.add('mat-snack-bar-center');
        }
        if (this.snackBarConfig.verticalPosition === 'top') {
            this._elementRef.nativeElement.classList.add('mat-snack-bar-top');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacySnackBarContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatLegacySnackBarContainer, selector: "snack-bar-container", host: { listeners: { "@state.done": "onAnimationEnd($event)" }, properties: { "@state": "_animationState" }, classAttribute: "mat-snack-bar-container" }, usesInheritance: true, ngImport: i0, template: "<!-- Initially holds the snack bar content, will be empty after announcing to screen readers. -->\n<div aria-hidden=\"true\">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n\n<!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n<div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n", styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}"], dependencies: [{ kind: "directive", type: i1.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matSnackBarAnimations.snackBarState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacySnackBarContainer, decorators: [{
            type: Component,
            args: [{ selector: 'snack-bar-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matSnackBarAnimations.snackBarState], host: {
                        'class': 'mat-snack-bar-container',
                        '[@state]': '_animationState',
                        '(@state.done)': 'onAnimationEnd($event)',
                    }, template: "<!-- Initially holds the snack bar content, will be empty after announcing to screen readers. -->\n<div aria-hidden=\"true\">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n\n<!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n<div [attr.aria-live]=\"_live\" [attr.role]=\"_role\" [attr.id]=\"_liveElementId\"></div>\n", styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktc25hY2stYmFyL3NuYWNrLWJhci1jb250YWluZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXNuYWNrLWJhci9zbmFjay1iYXItY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwRixPQUFPLEVBQUMseUJBQXlCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBRTdGOzs7OztHQUtHO0FBa0JILE1BQU0sT0FBTywwQkFBMkIsU0FBUSx5QkFBeUI7SUFDcEQsb0JBQW9CO1FBQ3JDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRTdCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsS0FBSyxRQUFRLEVBQUU7WUFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixLQUFLLEtBQUssRUFBRTtZQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDbkU7SUFDSCxDQUFDOzhHQVhVLDBCQUEwQjtrR0FBMUIsMEJBQTBCLDRPQ2xDdkMsc1lBT0EsMGtCRG9CYyxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQzs7MkZBT3RDLDBCQUEwQjtrQkFqQnRDLFNBQVM7K0JBQ0UscUJBQXFCLG1CQU9kLHVCQUF1QixDQUFDLE9BQU8saUJBQ2pDLGlCQUFpQixDQUFDLElBQUksY0FDekIsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsUUFDM0M7d0JBQ0osT0FBTyxFQUFFLHlCQUF5Qjt3QkFDbEMsVUFBVSxFQUFFLGlCQUFpQjt3QkFDN0IsZUFBZSxFQUFFLHdCQUF3QjtxQkFDMUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge19NYXRTbmFja0JhckNvbnRhaW5lckJhc2UsIG1hdFNuYWNrQmFyQW5pbWF0aW9uc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJztcblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIHNuYWNrIGJhciBjb250ZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRTbmFja0JhckNvbnRhaW5lcmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NuYWNrLWJhci1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ3NuYWNrLWJhci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbmFjay1iYXItY29udGFpbmVyLmNzcyddLFxuICAvLyBJbiBJdnkgZW1iZWRkZWQgdmlld3Mgd2lsbCBiZSBjaGFuZ2UgZGV0ZWN0ZWQgZnJvbSB0aGVpciBkZWNsYXJhdGlvbiBwbGFjZSwgcmF0aGVyIHRoYW5cbiAgLy8gd2hlcmUgdGhleSB3ZXJlIHN0YW1wZWQgb3V0LiBUaGlzIG1lYW5zIHRoYXQgd2UgY2FuJ3QgaGF2ZSB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciBiZSBPblB1c2gsXG4gIC8vIGJlY2F1c2UgaXQgbWlnaHQgY2F1c2Ugc25hY2sgYmFycyB0aGF0IHdlcmUgb3BlbmVkIGZyb20gYSB0ZW1wbGF0ZSBub3QgdG8gYmUgb3V0IG9mIGRhdGUuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW21hdFNuYWNrQmFyQW5pbWF0aW9ucy5zbmFja0JhclN0YXRlXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc25hY2stYmFyLWNvbnRhaW5lcicsXG4gICAgJ1tAc3RhdGVdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAc3RhdGUuZG9uZSknOiAnb25BbmltYXRpb25FbmQoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNuYWNrQmFyQ29udGFpbmVyIGV4dGVuZHMgX01hdFNuYWNrQmFyQ29udGFpbmVyQmFzZSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBfYWZ0ZXJQb3J0YWxBdHRhY2hlZCgpIHtcbiAgICBzdXBlci5fYWZ0ZXJQb3J0YWxBdHRhY2hlZCgpO1xuXG4gICAgaWYgKHRoaXMuc25hY2tCYXJDb25maWcuaG9yaXpvbnRhbFBvc2l0aW9uID09PSAnY2VudGVyJykge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1zbmFjay1iYXItY2VudGVyJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc25hY2tCYXJDb25maWcudmVydGljYWxQb3NpdGlvbiA9PT0gJ3RvcCcpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtc25hY2stYmFyLXRvcCcpO1xuICAgIH1cbiAgfVxufVxuIiwiPCEtLSBJbml0aWFsbHkgaG9sZHMgdGhlIHNuYWNrIGJhciBjb250ZW50LCB3aWxsIGJlIGVtcHR5IGFmdGVyIGFubm91bmNpbmcgdG8gc2NyZWVuIHJlYWRlcnMuIC0tPlxuPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldD48L25nLXRlbXBsYXRlPlxuPC9kaXY+XG5cbjwhLS0gV2lsbCByZWNlaXZlIHRoZSBzbmFjayBiYXIgY29udGVudCBmcm9tIHRoZSBub24tbGl2ZSBkaXYsIG1vdmUgd2lsbCBoYXBwZW4gYSBzaG9ydCBkZWxheSBhZnRlciBvcGVuaW5nIC0tPlxuPGRpdiBbYXR0ci5hcmlhLWxpdmVdPVwiX2xpdmVcIiBbYXR0ci5yb2xlXT1cIl9yb2xlXCIgW2F0dHIuaWRdPVwiX2xpdmVFbGVtZW50SWRcIj48L2Rpdj5cbiJdfQ==