/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Inject, isDevMode, QueryList, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
// Boilerplate for applying mixins to MatToolbar.
/** @docs-private */
class MatToolbarBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatToolbarMixinBase = mixinColor(MatToolbarBase);
export class MatToolbarRow {
}
MatToolbarRow.decorators = [
    { type: Directive, args: [{
                selector: 'mat-toolbar-row',
                exportAs: 'matToolbarRow',
                host: { 'class': 'mat-toolbar-row' },
            },] }
];
export class MatToolbar extends _MatToolbarMixinBase {
    constructor(elementRef, _platform, document) {
        super(elementRef);
        this._platform = _platform;
        // TODO: make the document a required param when doing breaking changes.
        this._document = document;
    }
    ngAfterViewInit() {
        if (!isDevMode() || !this._platform.isBrowser) {
            return;
        }
        this._checkToolbarMixedModes();
        this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
    }
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    _checkToolbarMixedModes() {
        if (!this._toolbarRows.length) {
            return;
        }
        // Check if there are any other DOM nodes that can display content but aren't inside of
        // a <mat-toolbar-row> element.
        const isCombinedUsage = Array.from(this._elementRef.nativeElement.childNodes)
            .filter(node => !(node.classList && node.classList.contains('mat-toolbar-row')))
            .filter(node => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8))
            .some(node => !!(node.textContent && node.textContent.trim()));
        if (isCombinedUsage) {
            throwToolbarMixedModesError();
        }
    }
}
MatToolbar.decorators = [
    { type: Component, args: [{
                selector: 'mat-toolbar',
                exportAs: 'matToolbar',
                template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n",
                inputs: ['color'],
                host: {
                    'class': 'mat-toolbar',
                    '[class.mat-toolbar-multiple-rows]': '_toolbarRows.length > 0',
                    '[class.mat-toolbar-single-row]': '_toolbarRows.length === 0',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}\n"]
            },] }
];
MatToolbar.ctorParameters = () => [
    { type: ElementRef },
    { type: Platform },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
MatToolbar.propDecorators = {
    _toolbarRows: [{ type: ContentChildren, args: [MatToolbarRow, { descendants: true },] }]
};
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sYmFyL3Rvb2xiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUcxRSxpREFBaUQ7QUFDakQsb0JBQW9CO0FBQ3BCLE1BQU0sY0FBYztJQUNsQixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7QUFDRCxNQUFNLG9CQUFvQixHQUF5QyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7QUFPOUYsTUFBTSxPQUFPLGFBQWE7OztZQUx6QixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQzthQUNuQzs7QUFpQkQsTUFBTSxPQUFPLFVBQVcsU0FBUSxvQkFBb0I7SUFNbEQsWUFDRSxVQUFzQixFQUNkLFNBQW1CLEVBQ1QsUUFBYztRQUNoQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFGVixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBSTNCLHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQzdDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7T0FFRztJQUNLLHVCQUF1QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDN0IsT0FBTztTQUNSO1FBRUQsdUZBQXVGO1FBQ3ZGLCtCQUErQjtRQUMvQixNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFjLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQzthQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7YUFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpFLElBQUksZUFBZSxFQUFFO1lBQ25CLDJCQUEyQixFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDOzs7WUF6REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixRQUFRLEVBQUUsWUFBWTtnQkFDdEIsNkZBQTJCO2dCQUUzQixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsYUFBYTtvQkFDdEIsbUNBQW1DLEVBQUUseUJBQXlCO29CQUM5RCxnQ0FBZ0MsRUFBRSwyQkFBMkI7aUJBQzlEO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQXBDQyxVQUFVO1lBUkosUUFBUTs0Q0FzRFgsTUFBTSxTQUFDLFFBQVE7OzsyQkFMakIsZUFBZSxTQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7O0FBMENyRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsMkJBQTJCO0lBQ3pDLE1BQU0sS0FBSyxDQUFDLDZEQUE2RDtRQUN2RSx3RkFBd0Y7UUFDeEYsK0NBQStDLENBQUMsQ0FBQztBQUNyRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgaXNEZXZNb2RlLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuQ29sb3IsIENhbkNvbG9yQ3RvciwgbWl4aW5Db2xvcn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRUb29sYmFyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFRvb2xiYXJCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuY29uc3QgX01hdFRvb2xiYXJNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXRUb29sYmFyQmFzZSA9IG1peGluQ29sb3IoTWF0VG9vbGJhckJhc2UpO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdG9vbGJhci1yb3cnLFxuICBleHBvcnRBczogJ21hdFRvb2xiYXJSb3cnLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC10b29sYmFyLXJvdyd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sYmFyUm93IHt9XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10b29sYmFyJyxcbiAgZXhwb3J0QXM6ICdtYXRUb29sYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICd0b29sYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndG9vbGJhci5jc3MnXSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRvb2xiYXInLFxuICAgICdbY2xhc3MubWF0LXRvb2xiYXItbXVsdGlwbGUtcm93c10nOiAnX3Rvb2xiYXJSb3dzLmxlbmd0aCA+IDAnLFxuICAgICdbY2xhc3MubWF0LXRvb2xiYXItc2luZ2xlLXJvd10nOiAnX3Rvb2xiYXJSb3dzLmxlbmd0aCA9PT0gMCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sYmFyIGV4dGVuZHMgX01hdFRvb2xiYXJNaXhpbkJhc2UgaW1wbGVtZW50cyBDYW5Db2xvciwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCB0b29sYmFyIHJvdyBlbGVtZW50cyB0aGF0IGhhdmUgYmVlbiBwcm9qZWN0ZWQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VG9vbGJhclJvdywge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3Rvb2xiYXJSb3dzOiBRdWVyeUxpc3Q8TWF0VG9vbGJhclJvdz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ/OiBhbnkpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIFRPRE86IG1ha2UgdGhlIGRvY3VtZW50IGEgcmVxdWlyZWQgcGFyYW0gd2hlbiBkb2luZyBicmVha2luZyBjaGFuZ2VzLlxuICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCFpc0Rldk1vZGUoKSB8fCAhdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fY2hlY2tUb29sYmFyTWl4ZWRNb2RlcygpO1xuICAgIHRoaXMuX3Rvb2xiYXJSb3dzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoZWNrVG9vbGJhck1peGVkTW9kZXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIGRldmVsb3BlcnMgYXJlIGF0dGVtcHRpbmcgdG8gY29tYmluZSB0aGUgZGlmZmVyZW50IHRvb2xiYXIgcm93IG1vZGVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tUb29sYmFyTWl4ZWRNb2RlcygpIHtcbiAgICBpZiAoIXRoaXMuX3Rvb2xiYXJSb3dzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgb3RoZXIgRE9NIG5vZGVzIHRoYXQgY2FuIGRpc3BsYXkgY29udGVudCBidXQgYXJlbid0IGluc2lkZSBvZlxuICAgIC8vIGEgPG1hdC10b29sYmFyLXJvdz4gZWxlbWVudC5cbiAgICBjb25zdCBpc0NvbWJpbmVkVXNhZ2UgPSBBcnJheS5mcm9tPEhUTUxFbGVtZW50Pih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcylcbiAgICAgIC5maWx0ZXIobm9kZSA9PiAhKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtdG9vbGJhci1yb3cnKSkpXG4gICAgICAuZmlsdGVyKG5vZGUgPT4gbm9kZS5ub2RlVHlwZSAhPT0gKHRoaXMuX2RvY3VtZW50ID8gdGhpcy5fZG9jdW1lbnQuQ09NTUVOVF9OT0RFIDogOCkpXG4gICAgICAuc29tZShub2RlID0+ICEhKG5vZGUudGV4dENvbnRlbnQgJiYgbm9kZS50ZXh0Q29udGVudC50cmltKCkpKTtcblxuICAgIGlmIChpc0NvbWJpbmVkVXNhZ2UpIHtcbiAgICAgIHRocm93VG9vbGJhck1peGVkTW9kZXNFcnJvcigpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiBhdHRlbXB0aW5nIHRvIGNvbWJpbmUgdGhlIGRpZmZlcmVudCB0b29sYmFyIHJvdyBtb2Rlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93VG9vbGJhck1peGVkTW9kZXNFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoJ01hdFRvb2xiYXI6IEF0dGVtcHRpbmcgdG8gY29tYmluZSBkaWZmZXJlbnQgdG9vbGJhciBtb2Rlcy4gJyArXG4gICAgJ0VpdGhlciBzcGVjaWZ5IG11bHRpcGxlIGA8bWF0LXRvb2xiYXItcm93PmAgZWxlbWVudHMgZXhwbGljaXRseSBvciBqdXN0IHBsYWNlIGNvbnRlbnQgJyArXG4gICAgJ2luc2lkZSBvZiBhIGA8bWF0LXRvb2xiYXI+YCBmb3IgYSBzaW5nbGUgcm93LicpO1xufVxuIl19